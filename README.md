# Case Lens — Legal Crime Identifier

Describe a crime or incident in plain, casual language and get back the likely matching law, article, and section — for informational triage, not formal legal advice.

## Repository Layout

This project is separated into two isolated, self-contained modules:

```
legal-crime-identifier/
├── website/                   # Everything needed to publish to a web domain
│   ├── client/                # Vite + React + Tailwind frontend
│   ├── server/                # Express API backend (Groq LLM calls)
│   └── package.json           # Unified web scripts for deployment
└── desktop/                   # Standalone desktop executable wrapper
    ├── main.js                # Electron process controller
    ├── package.json           # Packaging & build scripts
    ├── start.bat / stop.bat   # Local development launchers
    └── dist-desktop/          # Output directory for Windows EXE
```

---

## 🌐 1. Web Domain Publishing (`website/`)

The `website/` directory contains both the frontend and backend ready for cloud hosting.

### Quick Start (Local Web Server)
```bash
cd website
npm run build
npm start
```
The server binds to port 5000 and statically serves the React frontend production build.

### Deployment Instructions
For step-by-step instructions on publishing your site to a live domain using hosting platforms like Render or Railway, see [Walkthrough & Publishing Guide](file:///C:/Users/Abinesh/.gemini/antigravity-ide/brain/939b1108-f37b-4f2d-9213-41ab3406768b/walkthrough.md).

---

## 💻 2. Desktop Application (`desktop/`)

The `desktop/` directory packages the application as a native Windows desktop executable using Electron.

### Running locally
Run `desktop/start.bat` or execute:
```bash
cd desktop
npm start
```

### Packaging into `.exe`
```bash
cd desktop
npm run package
```
The packaged application will be generated in `desktop/dist-desktop/`.

---

## Environment Configuration

Both web and desktop environments require a `GROQ_API_KEY` set in `website/server/.env` (or set as a cloud environment variable):

```env
GROQ_API_KEY=your_groq_api_key_here
LEGAL_JURISDICTION=India
```

Get a free API key at [console.groq.com](https://console.groq.com/keys).
