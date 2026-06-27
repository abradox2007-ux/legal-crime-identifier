const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Calls the backend's /api/analyze endpoint.
 * Always resolves to { ok: true, data } or { ok: false, error, message }
 * so the UI never has to deal with thrown exceptions from this layer.
 */
export async function analyzeCrime(description) {
  try {
    const customApiKey = localStorage.getItem("case-lens-groq-key") || "";
    const res = await fetch(`${API_URL}/api/analyze`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Groq-API-Key": customApiKey
      },
      body: JSON.stringify({ description }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        ok: false,
        error: data?.error || "request_failed",
        message: data?.message || "Something went wrong talking to the server.",
      };
    }

    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      error: "network_error",
      message: "Couldn't reach the server. Check that the API is running and try again.",
    };
  }
}
