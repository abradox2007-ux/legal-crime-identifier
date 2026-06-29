import ThemeToggle from "./ThemeToggle.jsx";

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="mx-auto flex max-w-2xl items-center justify-between px-6 pt-10 pb-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brass-500 text-brass-500">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3Z" />
            <path d="M9 12.5l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="leading-tight">
          <p className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">Case Lens</p>
          <p className="text-xs text-ink-400">Describe it. Find the law.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
