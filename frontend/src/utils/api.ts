import axios, { type InternalAxiosRequestConfig, isAxiosError } from "axios";

function getBackendUrl(): string {
  // Always use relative paths — Next.js rewrites proxy /api to the backend.
  // This works in both dev (via next.config rewrites) and production (standalone).
  if (typeof window !== "undefined") return "";

  // Server-side (SSR/RSC): use the internal Docker/network URL so server
  // components can reach the backend directly without going through the proxy.
  const env = process.env.BACKEND_INTERNAL_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;
  if (env !== undefined && env !== "") return env;
  return "http://localhost:8000";
}

export const API_BASE = `${getBackendUrl()}/api`;

/** Origin for bare `fetch` calls. Always relative in the browser (proxy handles routing). */
export function getApiOrigin(): string {
  if (typeof window !== "undefined") return "";
  // Server-side: use internal URL
  const env = process.env.BACKEND_INTERNAL_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;
  if (env !== undefined && env !== "") return env.replace(/\/$/, "");
  return "http://localhost:8000";
}

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[API] Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
  }
  if (typeof window === "undefined") return config;
  const adminToken = localStorage.getItem("admin_token");
  const token = localStorage.getItem("token");
  const url = config.url ?? "";

  if (adminToken !== null && url.includes("/admin")) {
    config.headers.set("Authorization", `Bearer ${adminToken}`);
  } else if (token !== null) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === "development") {
      console.error("[API] Error:", error.message, error.response?.data || error.config?.url);
    }
    // Rejected Bearer: clear stale session so UI matches chat/auth errors (e.g. SECRET_KEY rotation, wrong DB).
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      const auth = error.config?.headers?.Authorization;
      if (typeof auth === "string" && auth.startsWith("Bearer ")) {
        localStorage.removeItem("token");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_email");
        window.dispatchEvent(new CustomEvent("authLogout"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
