# Case Lens

Describe a crime or incident in plain, casual language and get back the likely matching law,
article, and section — for informational triage, not formal legal advice.

```
legal-crime-identifier/
├── server/        Express API — calls the LLM, validates its JSON, serves /api/analyze
│   ├── index.js
│   ├── routes/analyze.js
│   └── prompts/systemPrompt.js   ← the system prompt; edit this to change jurisdiction/behavior
└── client/        Vite + React + Tailwind frontend
    └── src/
        ├── App.jsx
        ├── components/            CrimeInputForm, ResultCard, LoadingSkeleton, ErrorMessage, ThemeToggle
        ├── hooks/useTheme.js
        └── lib/api.js
```

## 1. Get an API key (free)

This uses [Groq](https://console.groq.com) to run open-source models (Llama 3.3, etc.) — it's
free to start and very fast. Create an API key at https://console.groq.com/keys.

> **Want fully local instead?** Skip the API key and run [Ollama](https://ollama.com) locally
> (`ollama pull llama3.1` then `ollama serve`). Ollama exposes an OpenAI-compatible endpoint at
> `http://localhost:11434/v1/chat/completions`. In `server/routes/analyze.js`, change `GROQ_URL`
> to that address and drop the `Authorization` header — everything else works unchanged.

## 2. Run the backend

```bash
cd server
cp .env.example .env
# paste your key into .env as GROQ_API_KEY=...
npm install
npm run dev
```

The API starts on `http://localhost:5000`. Check it with `curl http://localhost:5000/api/health`.

## 3. Run the frontend

```bash
cd client
cp .env.example .env   # only needed if your API isn't on localhost:5000
npm install
npm run dev
```

Open `http://localhost:5173`.

## How it works

1. The user types a casual description into the textarea (`CrimeInputForm`).
2. The frontend POSTs `{ description }` to `POST /api/analyze`.
3. The backend sends a system prompt + the description to the LLM via Groq's
   OpenAI-compatible `/v1/chat/completions` endpoint, with `response_format: json_object`
   so the model is constrained to return JSON.
4. The backend parses and **validates the shape** of the JSON before trusting it (see
   `validateShape` in `routes/analyze.js`) and retries once automatically if the first
   attempt fails or returns malformed JSON.
5. The fixed disclaimer text is attached server-side (never trusted to the model), and the
   result is returned to the frontend.
6. `ResultCard` renders one of three states the model can return:
   - `matched` — full result card with category, law, article/chapter, section, explanation,
     confidence badge, and any secondary offenses worth noting.
   - `unclear` — the description didn't have enough detail; shows one clarifying question.
   - `not_legal_matter` — the text wasn't describing a criminal incident at all.

## Customizing the jurisdiction

By default the prompt targets Indian law (Bharatiya Nyaya Sanhita, 2023 — the code that
replaced the IPC in 2024). To target a different country, set `LEGAL_JURISDICTION` in
`server/.env`, e.g.:

```
LEGAL_JURISDICTION=United Kingdom
LEGAL_JURISDICTION=California, USA
```

The prompt in `server/prompts/systemPrompt.js` instructs the model to cite that
jurisdiction's real, currently-in-force statute rather than inventing one. For production use
with a specific jurisdiction, consider grounding answers further with retrieval over an actual
statute database rather than relying on model knowledge alone — model knowledge of exact
section numbers can be wrong, which is why the UI always shows a confidence level and the
disclaimer.

## Notes on this being an MVP, not a legal product

- The model can still get specific section numbers wrong — that's why every result carries a
  confidence level and a disclaimer, and why `additional_sections` exists rather than forcing
  a single "correct" answer.
- There's no database here — nothing is persisted. Add one (e.g. Postgres + Prisma) if you
  want history, accounts, or analytics.
- Rate limiting is in-memory (`express-rate-limit`) and resets on server restart; swap in a
  Redis-backed store before deploying somewhere with multiple instances.
