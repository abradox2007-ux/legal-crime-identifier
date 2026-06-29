export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="mt-6 animate-fade-up rounded-2xl border border-crimson-500/30 bg-crimson-500/5 p-6 dark:border-crimson-400/30">
      <div className="flex items-start gap-3">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 flex-shrink-0 text-crimson-500" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5" strokeLinecap="round" />
          <path d="M12 16h.01" strokeLinecap="round" />
        </svg>
        <div className="flex-1">
          <p className="font-medium text-crimson-600 dark:text-crimson-400">Couldn't complete the match</p>
          <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-lg border border-crimson-500/40 px-3 py-1.5 text-sm font-medium text-crimson-600 transition-colors hover:bg-crimson-500/10 dark:text-crimson-400"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
