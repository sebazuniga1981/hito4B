const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

// In development we keep localhost as fallback.
// In production, API URL must be explicitly configured (e.g. Render env var).
const API_URL = configuredApiUrl || (import.meta.env.DEV ? "http://localhost:3000" : "");

export default API_URL;
