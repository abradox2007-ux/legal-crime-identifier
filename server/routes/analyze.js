// server/routes/analyze.js
import { Router } from "express";
import { buildSystemPrompt, buildUserPrompt } from "../prompts/systemPrompt.js";

const router = Router();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MIN_LENGTH = 12;
const MAX_LENGTH = 2000;

const VALID_STATUS = new Set(["matched", "unclear", "not_legal_matter"]);
const VALID_CONFIDENCE = new Set(["high", "medium", "low", null]);

/** Strips accidental markdown fences and grabs the outermost {...} block. */
function extractJson(raw) {
  const fenced = raw.replace(/```json|```/gi, "").trim();
  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in model output");
  }
  return JSON.parse(fenced.slice(start, end + 1));
}

/** Defensive shape-check so a malformed model reply never reaches the client untyped. */
function validateShape(obj) {
  if (!obj || typeof obj !== "object") throw new Error("Model output was not an object");
  if (!VALID_STATUS.has(obj.status)) throw new Error("Invalid or missing 'status'");
  if (!VALID_CONFIDENCE.has(obj.confidence ?? null)) throw new Error("Invalid 'confidence'");
  if (!Array.isArray(obj.additional_sections)) obj.additional_sections = [];
  if (obj.status === "unclear" && !obj.clarifying_question) {
    throw new Error("'unclear' status requires a clarifying_question");
  }
  if (obj.status === "not_legal_matter" && !obj.message) {
    throw new Error("'not_legal_matter' status requires a message");
  }
  if (obj.status === "matched") {
    const required = ["crime_category", "law_name", "section", "section_title", "explanation"];
    for (const field of required) {
      if (!obj[field]) throw new Error(`'matched' status missing required field: ${field}`);
    }
  }
  return obj;
}

router.post("/", async (req, res) => {
  const { description } = req.body ?? {};

  if (typeof description !== "string" || description.trim().length < MIN_LENGTH) {
    return res.status(400).json({
      error: "input_too_short",
      message: `Please describe what happened in at least ${MIN_LENGTH} characters so the assistant has enough to work with.`,
    });
  }
  if (description.length > MAX_LENGTH) {
    return res.status(400).json({
      error: "input_too_long",
      message: `Please keep the description under ${MAX_LENGTH} characters.`,
    });
  }

  const customApiKey = req.headers["x-groq-api-key"];
  const apiKey = customApiKey || process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(400).json({
      error: "api_key_missing",
      message: "Groq API Key is missing. Please click the Settings icon (gear) in the top-right corner to configure your API key.",
    });
  }

  const jurisdiction = process.env.LEGAL_JURISDICTION || "India";
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const callGroq = async () => {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 900,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt(jurisdiction) },
          { role: "user", content: buildUserPrompt(description.trim()) },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Groq API error ${response.status}: ${text.slice(0, 300)}`);
    }
    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) throw new Error("Empty response from model");
    return raw;
  };

  try {
    let raw;
    try {
      raw = await callGroq();
    } catch (firstErr) {
      // One retry — transient API hiccups and the rare malformed-JSON reply
      // are common enough with LLMs to deserve a single automatic retry.
      console.warn("First analyze attempt failed, retrying once:", firstErr.message);
      raw = await callGroq();
    }

    const parsed = validateShape(extractJson(raw));

    // Disclaimer text is fixed here, server-side, rather than trusted to the model,
    // so the wording is always exact regardless of what the LLM returns.
    parsed.disclaimer =
      "This is for informational purposes only and does not constitute formal legal advice.";
    parsed.jurisdiction = jurisdiction;

    return res.json(parsed);
  } catch (err) {
    console.error("Analyze failed:", err.message);
    return res.status(502).json({
      error: "analysis_failed",
      message:
        "The assistant couldn't produce a confident match this time. Try adding a bit more detail (what happened, where, and roughly when) and submit again.",
    });
  }
});

export default router;
