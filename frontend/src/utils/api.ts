import axios, { type InternalAxiosRequestConfig } from "axios";

function getBackendUrl(): string {
  // In production, force relative paths to prevent domain mismatch/CORS issues
  if (process.env.NODE_ENV === "production") return "";

  const env = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (env !== undefined && env !== "") return env;
  return "http://localhost:8000";
}

export const API_BASE = `${getBackendUrl()}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  console.log(`[API] Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
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
    console.error("[API] Error:", error.message, error.response?.data || error.config?.url);
    return Promise.reject(error);
  }
);

export default api;
