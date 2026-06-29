import { useState } from "react";

const EXAMPLES = [
  "Someone broke into my garage at night and stole my bicycle while I was asleep.",
  "A guy on a bike snatched my phone out of my hand on the street and rode off.",
  "My coworker keeps reading my private messages on my laptop without asking.",
  "Someone created a fake Instagram account pretending to be me and posted embarrassing stuff.",
];

const MIN_LENGTH = 12;
const MAX_LENGTH = 2000;

export default function CrimeInputForm({ onSubmit, isLoading }) {
  const [text, setText] = useState("");
  const tooShort = text.trim().length > 0 && text.trim().length < MIN_LENGTH;
  const canSubmit = text.trim().length >= MIN_LENGTH && text.length <= MAX_LENGTH && !isLoading;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(text.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-ink-200 bg-white shadow-case dark:border-ink-600 dark:bg-ink-800">
      <div className="flex items-center justify-between border-b border-dashed border-ink-200 px-5 py-3 dark:border-ink-600">
        <span className="font-mono text-xs uppercase tracking-widest text-ink-400">Case Description</span>
        <span className={`font-mono text-xs ${text.length > MAX_LENGTH ? "text-crimson-500" : "text-ink-400"}`}>
          {text.length}/{MAX_LENGTH}
        </span>
      </div>

      <div className="px-5 pt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell it like you'd tell a friend. e.g. “Someone broke into my garage at night and stole my bicycle while I was asleep.”"
          rows={6}
          className="w-full resize-none bg-transparent font-body text-base leading-8 text-ink-900 placeholder:text-ink-400/70 focus:outline-none dark:text-ink-50"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 px-5 pb-4 pt-1">
        <span className="text-xs text-ink-400">Try:</span>
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setText(example)}
            className="rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-600 transition-colors hover:border-brass-500 hover:text-brass-600 dark:border-ink-600 dark:text-ink-200 dark:hover:border-brass-400 dark:hover:text-brass-400"
          >
            {example.length > 38 ? example.slice(0, 38) + "…" : example}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-ink-100 px-5 py-4 dark:border-ink-700">
        <p className="text-xs text-ink-400" aria-live="polite">
          {tooShort ? `Add a bit more detail (at least ${MIN_LENGTH} characters).` : "No legal jargon needed — plain language works best."}
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 rounded-lg bg-ink-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-brass-500 dark:text-ink-950 dark:hover:bg-brass-400"
        >
          {isLoading ? "Reviewing…" : "Find the matching law"}
        </button>
      </div>
    </form>
  );
}
