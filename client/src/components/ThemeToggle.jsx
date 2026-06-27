export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative flex h-9 w-16 items-center rounded-full border border-ink-200 bg-white px-1 transition-colors dark:border-ink-600 dark:bg-ink-800"
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-brass-400 shadow-case transition-transform duration-200 dark:bg-brass-400 dark:text-ink-900 ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <circle cx="12" cy="12" r="4" />
            <path
              strokeWidth="2"
              stroke="currentColor"
              d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
