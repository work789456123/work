import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

// ─── Team testing via ngrok ──────────────────────────────────────────────────
export const BASE_URL = 'https://pashuvaani-backend.onrender.com';
// For production: export const BASE_URL = 'https://api.pashuvaani.com';

const TOKEN_KEY = 'pashuvaani_access_token';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

// ─── Axios instance ──────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT on every request
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
    }
    return Promise.reject(error);
  }
);

export default api;
