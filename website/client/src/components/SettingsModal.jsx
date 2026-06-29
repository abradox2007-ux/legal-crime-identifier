import { useState, useEffect } from "react";

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem("case-lens-groq-key") || "";
      setApiKey(savedKey);
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("case-lens-groq-key", apiKey.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-ink-100 bg-white/90 p-6 shadow-2xl backdrop-blur-md dark:border-ink-800 dark:bg-ink-900/90">
        
        {/* Decorative background gradients */}
        <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-brass-400/10 blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-ink-400/10 blur-xl"></div>

        <div className="flex items-center justify-between pb-4 border-b border-ink-100 dark:border-ink-800">
          <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-brass-500" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Application Settings
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-900 dark:hover:bg-ink-800 dark:hover:text-ink-50" type="button">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300">
              Groq API Key
            </label>
            <p className="text-xs text-ink-400 mt-1 mb-2">
              The API key is stored locally on your device and sent only to the official Groq API endpoint.
            </p>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_..."
                className="block w-full rounded-lg border border-ink-200 bg-ink-50 py-2.5 pl-3 pr-10 text-sm outline-none transition-all focus:border-brass-500 focus:bg-white focus:ring-1 focus:ring-brass-500 dark:border-ink-800 dark:bg-ink-950 dark:text-ink-50 dark:focus:border-brass-500 dark:focus:bg-ink-900"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
              >
                {showKey ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.815 7.815L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-brass-500/5 border border-brass-500/10 p-3 text-xs text-brass-700 dark:text-brass-300">
            <strong>Need an API key?</strong> Sign up at{" "}
            <a
              href="https://console.groq.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brass-600 underline hover:text-brass-700 dark:text-brass-400"
            >
              console.groq.com
            </a>{" "}
            to get a developer key.
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-ink-100 pt-4 dark:border-ink-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-50 hover:text-ink-900 dark:border-ink-800 dark:text-ink-300 dark:hover:bg-ink-950 dark:hover:text-ink-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaved}
              className={`rounded-lg bg-brass-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brass-600 focus:outline-none focus:ring-2 focus:ring-brass-500/50 flex items-center gap-2 ${
                isSaved ? "bg-emerald-500 hover:bg-emerald-500" : ""
              }`}
            >
              {isSaved ? (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
