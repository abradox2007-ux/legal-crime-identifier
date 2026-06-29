import { useState } from "react";
import Header from "./components/Header.jsx";
import CrimeInputForm from "./components/CrimeInputForm.jsx";
import LoadingSkeleton from "./components/LoadingSkeleton.jsx";
import ResultCard from "./components/ResultCard.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import ConstitutionIndex from "./components/ConstitutionIndex.jsx";
import { useTheme } from "./hooks/useTheme.js";
import { analyzeCrime } from "./lib/api.js";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("analyze"); // "analyze" or "browse"
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastDescription, setLastDescription] = useState("");


  const runAnalysis = async (description) => {
    setLastDescription(description);
    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await analyzeCrime(description);

    setIsLoading(false);
    if (response.ok) {
      setResult(response.data);
    } else {
      setError(response.message);
    }
  };

  const handleRetry = () => {
    if (lastDescription) runAnalysis(lastDescription);
  };

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950 transition-colors duration-200">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="mx-auto max-w-2xl px-6 pb-20">
        {/* Navigation Tabs */}
        <div className="mb-6 flex justify-center gap-6 border-b border-ink-200/60 dark:border-ink-800">
          <button
            onClick={() => setActiveTab("analyze")}
            className={`pb-3 px-2 text-sm font-semibold tracking-wide transition relative ${
              activeTab === "analyze"
                ? "text-brass-600 dark:text-brass-400 font-bold"
                : "text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
            }`}
          >
            Identify Case
            {activeTab === "analyze" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brass-500 rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("browse")}
            className={`pb-3 px-2 text-sm font-semibold tracking-wide transition relative ${
              activeTab === "browse"
                ? "text-brass-600 dark:text-brass-400 font-bold"
                : "text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
            }`}
          >
            Constitution Index
            {activeTab === "browse" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brass-500 rounded-full"></span>
            )}
          </button>
        </div>

        {activeTab === "analyze" ? (
          <>
            <p className="mb-6 text-sm text-ink-500 dark:text-ink-300">
              Describe what happened in your own words — Case Lens maps it to the most likely
              matching law, article and section.
            </p>

            <CrimeInputForm onSubmit={runAnalysis} isLoading={isLoading} />

            {isLoading && <LoadingSkeleton />}
            {!isLoading && error && <ErrorMessage message={error} onRetry={handleRetry} />}
            {!isLoading && !error && result && <ResultCard result={result} />}
          </>
        ) : (
          <>
            <p className="mb-6 text-sm text-ink-500 dark:text-ink-300">
              Browse and query the entire Constitution of India in real-time. Search by article number, keywords, sections, or custom incidents.
            </p>
            <ConstitutionIndex />
          </>
        )}
      </main>

      <footer className="mx-auto max-w-2xl px-6 pb-10 text-center text-xs text-ink-400">
        Case Lens is an informational tool, not a law firm. For an actual legal matter,
        consult a licensed advocate or your local legal aid service.
      </footer>
    </div>
  );
}

