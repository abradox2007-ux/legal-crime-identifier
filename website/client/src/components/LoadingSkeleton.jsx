export default function LoadingSkeleton() {
  return (
    <div
      role="status"
      aria-label="Reviewing the description"
      className="mt-6 animate-fade-up rounded-2xl border border-ink-200 bg-white p-6 shadow-case dark:border-ink-600 dark:bg-ink-800"
    >
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink-200 border-t-brass-500 dark:border-ink-600" />
        <span className="font-mono text-xs uppercase tracking-widest text-ink-400">
          Reviewing the details…
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-4 w-1/3 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
        <div className="h-3 w-full animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
        <div className="h-3 w-4/6 animate-pulse rounded bg-ink-100 dark:bg-ink-700" />
      </div>
    </div>
  );
}
