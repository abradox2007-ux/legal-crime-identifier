// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import analyzeRouter from "./routes/analyze.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: "10kb" }));

// Basic abuse protection — each LLM call costs money/time, so cap requests per IP.
const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "rate_limited", message: "Too many requests — please wait a moment and try again." },
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, jurisdiction: process.env.LEGAL_JURISDICTION || "India" });
});

app.use("/api/analyze", analyzeLimiter, analyzeRouter);

// Serve static client assets in production
const clientDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
    if (err) {
      res.status(404).json({ error: "not_found", message: `No route for ${req.method} ${req.path}` });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Crime-identifier API listening on http://localhost:${PORT}`);
  if (!process.env.GROQ_API_KEY) {
    console.warn("⚠️  GROQ_API_KEY is not set — /api/analyze will fail until you add one to server/.env");
  }
});
