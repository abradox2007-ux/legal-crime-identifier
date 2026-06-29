import { useState, useEffect, useMemo } from "react";

export default function ConstitutionIndex() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPart, setSelectedPart] = useState("all");
  const [selectedChapter, setSelectedChapter] = useState("all");
  
  // Page turning states
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState("next"); // "next" or "prev"
  const pageSize = 20;

  useEffect(() => {
    fetch("/articles.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load constitution data");
        }
        return res.json();
      })
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load the Constitution database. Please try again.");
        setLoading(false);
      });
  }, []);

  // Extract unique parts and chapters from articles for filters
  const uniqueParts = useMemo(() => {
    const partsMap = new Map();
    articles.forEach((art) => {
      if (art.part && !partsMap.has(art.part)) {
        partsMap.set(art.part, true);
      }
    });
    return Array.from(partsMap.keys());
  }, [articles]);

  const uniqueChapters = useMemo(() => {
    const chaptersMap = new Map();
    articles.forEach((art) => {
      if (art.chapter && (selectedPart === "all" || art.part === selectedPart)) {
        if (!chaptersMap.has(art.chapter)) {
          chaptersMap.set(art.chapter, true);
        }
      }
    });
    return Array.from(chaptersMap.keys());
  }, [articles, selectedPart]);

  // Reset chapter filter if the selected part changes and the chapter is no longer valid
  useEffect(() => {
    if (selectedChapter !== "all" && !uniqueChapters.includes(selectedChapter)) {
      setSelectedChapter("all");
    }
  }, [selectedPart, uniqueChapters, selectedChapter]);

  // Match and Rank logic
  const filteredAndSortedArticles = useMemo(() => {
    let result = [...articles];

    // 1. Part Filter
    if (selectedPart !== "all") {
      result = result.filter((art) => art.part === selectedPart);
    }

    // 2. Chapter Filter
    if (selectedChapter !== "all") {
      result = result.filter((art) => art.chapter === selectedChapter);
    }

    // 3. Search and Score
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return result;
    }

    const scored = result
      .map((art) => {
        let score = 0;
        const numberLower = art.number.toLowerCase();
        const titleLower = art.title.toLowerCase();
        const contentLower = art.content.toLowerCase();
        const partLower = art.part.toLowerCase();

        // Exact match on number
        if (numberLower === query || `article ${numberLower}` === query) {
          score += 1500;
        } else if (numberLower.includes(query)) {
          score += 600;
        }

        // Title matches
        if (titleLower.includes(query)) {
          score += 300;
          if (titleLower.startsWith(query)) {
            score += 100;
          }
        }

        // Content matches
        const words = query.split(/\s+/).filter(Boolean);
        let contentMatches = 0;
        words.forEach((word) => {
          if (word.length > 2) {
            const regex = new RegExp(word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g");
            const matches = contentLower.match(regex);
            if (matches) {
              contentMatches += matches.length;
            }
          }
        });
        
        // Phrase/Incident matches
        if (words.length > 1) {
          const matchCount = words.filter(word => contentLower.includes(word)).length;
          if (matchCount === words.length) {
            score += 400;
          } else if (matchCount > 1) {
            score += 150;
          }
        }

        score += contentMatches * 10;

        if (partLower.includes(query)) {
          score += 100;
        }

        return { ...art, score };
      })
      .filter((art) => art.score > 0);

    return scored.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const numA = parseInt(a.number) || 999;
      const numB = parseInt(b.number) || 999;
      return numA - numB;
    });
  }, [articles, searchQuery, selectedPart, selectedChapter]);

  // Reset pagination if query or filters change
  useEffect(() => {
    setCurrentPage(1);
    setDirection("next");
  }, [searchQuery, selectedPart, selectedChapter]);

  // Calculate paginated results
  const totalPages = Math.ceil(filteredAndSortedArticles.length / pageSize);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedArticles.slice(start, start + pageSize);
  }, [filteredAndSortedArticles, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setDirection(newPage > currentPage ? "next" : "prev");
      setCurrentPage(newPage);
      
      // Smooth scroll to top of results container
      const el = document.getElementById("results-top");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Text highlighting utility
  const highlightText = (text, highlight) => {
    if (!highlight || !highlight.trim()) return text;
    const terms = highlight.split(/\s+/).filter((t) => t.trim().length >= 2);
    if (terms.length === 0) return text;

    const escapedTerms = terms.map((t) => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
    const regex = new RegExp(`(${escapedTerms.join("|")})`, "gi");

    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-brass-400/30 text-ink-950 font-medium px-0.5 rounded dark:bg-brass-500/40 dark:text-brass-100"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedPart("all");
    setSelectedChapter("all");
  };

  return (
    <div className="animate-fade-up">
      {/* Search Header Container */}
      <div className="mb-8 rounded-xl border border-ink-100 bg-white p-6 shadow-case dark:border-ink-800 dark:bg-ink-900">
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full rounded-lg border border-ink-200 bg-ink-50 py-3 pl-11 pr-10 text-sm outline-none transition focus:border-brass-500 focus:bg-white dark:border-ink-700 dark:bg-ink-950 dark:focus:bg-ink-900"
            placeholder="Search by article, section, keywords or incident..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute top-1/2 left-4 -translate-y-1/2 text-ink-400">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[140px]">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-400">
              Part Filter
            </label>
            <select
              value={selectedPart}
              onChange={(e) => setSelectedPart(e.target.value)}
              className="w-full rounded-md border border-ink-200 bg-ink-50 px-3 py-2 text-xs outline-none focus:border-brass-500 dark:border-ink-700 dark:bg-ink-950"
            >
              <option value="all">All Parts</option>
              {uniqueParts.map((part) => (
                <option key={part} value={part}>
                  {part}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-400">
              Chapter Filter
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              disabled={uniqueChapters.length === 0}
              className="w-full rounded-md border border-ink-200 bg-ink-50 px-3 py-2 text-xs outline-none focus:border-brass-500 disabled:opacity-50 dark:border-ink-700 dark:bg-ink-950"
            >
              <option value="all">All Chapters</option>
              {uniqueChapters.map((chap) => (
                <option key={chap} value={chap}>
                  {chap}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedPart !== "all" || selectedChapter !== "all") && (
            <div className="flex items-end">
              <button
                onClick={handleClear}
                className="rounded-md border border-brass-500/20 bg-brass-500/5 px-3 py-2 text-xs font-medium text-brass-600 transition hover:bg-brass-500/10 dark:text-brass-400"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading & Errors */}
      {loading && (
        <div className="py-20 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brass-500 border-t-transparent"></div>
          <p className="mt-4 text-sm text-ink-400">Loading articles database...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-crimson-500/20 bg-crimson-500/5 p-4 text-sm text-crimson-600 dark:text-crimson-400">
          {error}
        </div>
      )}

      {/* Scroll anchor for pagination */}
      <div id="results-top"></div>

      {/* Article List */}
      {!loading && !error && (
        <>
          <div className="mb-4 flex items-center justify-between text-xs font-medium text-ink-400">
            <span>
              Showing {Math.min(filteredAndSortedArticles.length, currentPage * pageSize - pageSize + 1)}–
              {Math.min(filteredAndSortedArticles.length, currentPage * pageSize)} of{" "}
              {filteredAndSortedArticles.length} matching articles
            </span>
            {totalPages > 1 && (
              <span>
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          {/* Animate key forces React to trigger transition animation when currentPage changes */}
          <div
            key={currentPage}
            className={`space-y-6 ${
              direction === "next" ? "animate-page-turn-next" : "animate-page-turn-prev"
            }`}
          >
            {paginatedArticles.map((art) => (
              <article
                key={art.number}
                className="group relative overflow-hidden rounded-xl border border-ink-100 bg-white p-6 shadow-case transition duration-200 hover:-translate-y-0.5 hover:border-ink-200 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-ink-700"
              >
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-brass-600/30 via-brass-400/30 to-brass-600/30"></div>

                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-ink-50 pb-3 dark:border-ink-800">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold uppercase tracking-wider text-brass-600 dark:text-brass-400">
                      Article {art.number}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="rounded bg-ink-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400 dark:bg-ink-950">
                      {art.part}
                    </span>
                    {art.chapter && (
                      <span className="ml-2 rounded bg-brass-500/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brass-600 dark:bg-brass-500/10 dark:text-brass-400">
                        {art.chapter}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold text-ink-900 dark:text-ink-50 group-hover:text-brass-600 dark:group-hover:text-brass-400 transition">
                  {highlightText(art.title, searchQuery)}
                </h3>

                <p className="mt-3 leading-relaxed text-sm text-ink-600 dark:text-ink-300 font-normal">
                  {highlightText(art.content, searchQuery)}
                </p>
              </article>
            ))}

            {filteredAndSortedArticles.length === 0 && (
              <div className="rounded-xl border-2 border-dashed border-ink-100 py-16 text-center dark:border-ink-800">
                <svg
                  viewBox="0 0 24 24"
                  className="mx-auto h-8 w-8 text-ink-300 dark:text-ink-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m22 22-5.6-5.6M15 9l-6 6M9 9l6 6" />
                </svg>
                <p className="mt-4 text-sm font-medium text-ink-600 dark:text-ink-300">
                  No articles matched your criteria.
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  Try checking your spelling, removing keywords, or resetting filters.
                </p>
              </div>
            )}
          </div>

          {/* Left-to-Right Page Turning Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-ink-150 pt-6 mt-8 dark:border-ink-800">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2 text-xs font-semibold text-ink-600 shadow-sm transition hover:bg-ink-50 disabled:opacity-40 disabled:hover:bg-white active:scale-98 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-950"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Previous 20
              </button>

              <span className="font-display text-sm font-semibold text-ink-800 dark:text-ink-200">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2 text-xs font-semibold text-ink-600 shadow-sm transition hover:bg-ink-50 disabled:opacity-40 disabled:hover:bg-white active:scale-98 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-950"
              >
                Next 20
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
