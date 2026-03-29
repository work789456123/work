import axios from 'axios';

// Use relative path by default in production, absolute URL for dev
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL !== undefined
  ? import.meta.env.VITE_BACKEND_URL
  : (import.meta.env.PROD ? "" : "http://localhost:8000");

export const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('admin_token');
  const token = localStorage.getItem('token');
  
  if (adminToken && config.url.includes('/admin')) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
