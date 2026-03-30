import axios, { type InternalAxiosRequestConfig } from "axios";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL !== undefined
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.PROD
      ? ""
      : "http://localhost:8000";

export const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
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

export default api;
