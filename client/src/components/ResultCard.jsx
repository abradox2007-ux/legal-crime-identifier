const CONFIDENCE_STYLES = {
  high: "border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
  medium: "border-brass-500/50 text-brass-600 dark:text-brass-400",
  low: "border-crimson-500/40 text-crimson-600 dark:text-crimson-400",
};

function ConfidenceBadge({ level }) {
  if (!level) return null;
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider ${
        CONFIDENCE_STYLES[level] || "border-ink-300 text-ink-500"
      }`}
    >
      {level} confidence
    </span>
  );
}

/** The signature element: a small rotated brass "seal" that stamps onto a matched result. */
function CaseStamp() {
  return (
    <div className="pointer-events-none absolute -top-4 right-6 hidden animate-stamp sm:block">
      <div className="flex h-16 w-16 -rotate-[8deg] items-center justify-center rounded-full border-[3px] border-brass-500/80 bg-brass-50/90 text-brass-600 shadow-sm dark:bg-ink-900/90 dark:text-brass-400">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function SectionChip({ law, section, title }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-ink-200 bg-ink-50 dark:border-ink-600 dark:bg-ink-900">
      <div className="flex flex-col gap-1 border-l-4 border-brass-500 px-4 py-3">
        <span className="font-mono text-xs text-ink-400">{law}</span>
        <span className="font-mono text-base font-semibold text-ink-900 dark:text-ink-50">{section}</span>
        {title && <span className="text-sm text-ink-600 dark:text-ink-300">{title}</span>}
      </div>
    </div>
  );
}

function MatchedResult({ result }) {
  return (
    <div className="relative animate-fade-up rounded-2xl border border-ink-200 bg-white p-6 shadow-case dark:border-ink-600 dark:bg-ink-800">
      <CaseStamp />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-400">Likely Match</p>
        <ConfidenceBadge level={result.confidence} />
      </div>

      <h2 className="mt-2 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
        {result.crime_category}
      </h2>

      {result.article_or_chapter && (
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{result.article_or_chapter}</p>
      )}

      <div className="mt-4">
        <SectionChip law={result.law_name} section={result.section} title={result.section_title} />
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-ink-700 dark:text-ink-200">{result.explanation}</p>

      {result.additional_sections?.length > 0 && (
        <div className="mt-5 border-t border-dashed border-ink-200 pt-4 dark:border-ink-600">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-400">
            Also worth noting
          </p>
          <div className="space-y-3">
            {result.additional_sections.map((extra, i) => (
              <div key={i}>
                <SectionChip law={extra.law_name} section={extra.section} title={extra.section_title} />
                <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{extra.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UnclearResult({ result }) {
  return (
    <div className="animate-fade-up rounded-2xl border border-brass-500/40 bg-brass-50/40 p-6 dark:border-brass-400/30 dark:bg-ink-800">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-600 dark:text-brass-400">
        Needs a bit more detail
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-700 dark:text-ink-200">
        {result.clarifying_question}
      </p>
    </div>
  );
}

function NotLegalResult({ result }) {
  return (
    <div className="animate-fade-up rounded-2xl border border-ink-200 bg-ink-50 p-6 dark:border-ink-600 dark:bg-ink-900">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-400">Not a criminal matter</p>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-700 dark:text-ink-200">{result.message}</p>
    </div>
  );
}

export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="mt-6">
      {result.status === "matched" && <MatchedResult result={result} />}
      {result.status === "unclear" && <UnclearResult result={result} />}
      {result.status === "not_legal_matter" && <NotLegalResult result={result} />}

      <p className="mt-4 text-center text-xs text-ink-400">
        {result.disclaimer || "This is for informational purposes only and does not constitute formal legal advice."}
      </p>
    </div>
  );
}
