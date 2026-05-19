import { create } from 'zustand';
import api, { saveToken, removeToken, getToken } from '@/lib/api';
import * as SecureStore from 'expo-secure-store';

export interface AuthUser {
  id: string;
  full_name: string;
  phone_or_email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (phoneOrEmail: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  loadFromStorage: async () => {
    try {
      const token = await getToken();
      if (token) {
        set({ token, isAuthenticated: true });
        try {
          await get().fetchMe();
        } catch {
          // backend unreachable but token exists — stay logged in
          set({ isAuthenticated: true });
        }
      }
    } catch {
      await removeToken();
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMe: async () => {
    try {
      const res = await api.get('/api/auth/me');
      set({ user: res.data, isAuthenticated: true });
    } catch {
      // don't logout on network error — only on 401 (handled by interceptor)
    }
  },

  login: async (phoneOrEmail, password) => {
    const res = await api.post('/api/auth/login', {
      phone_or_email: phoneOrEmail,
      password,
    });
    const { access_token, user } = res.data;
    await saveToken(access_token);
    set({ token: access_token, user, isAuthenticated: true });
  },

  register: async (fullName, email, password) => {
    const res = await api.post('/api/auth/register', {
      full_name: fullName,
      email,
      password,
    });
    const { access_token, user } = res.data;
    await saveToken(access_token);
    set({ token: access_token, user, isAuthenticated: true });
  },

  logout: async () => {
    await removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
