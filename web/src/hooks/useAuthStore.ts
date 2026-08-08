// ─────────────────────────────────────────────
// Auth Store - Zustand
// ─────────────────────────────────────────────
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  setTokens: (access: string, refresh: string) => void;
}

const authStoreCreator = (set: any, get: any) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading to prevent premature rendering
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { accessToken, refreshToken, user } = response.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    delete api.defaults.headers.common['Authorization'];
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const { accessToken, refreshToken } = get();
    if (!accessToken) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const response = await api.get('/auth/me');
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      // Try to refresh token
      if (refreshToken) {
        const refreshed = await get().refreshAccessToken();
        if (!refreshed) {
          get().logout();
        }
      } else {
        get().logout();
      }
      set({ isLoading: false });
    }
  },

  refreshAccessToken: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return false;

    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      set({ accessToken, refreshToken: newRefreshToken });
      return true;
    } catch {
      get().logout();
      return false;
    }
  },

  setTokens: (access: string, refresh: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
  },
});

export const useAuthStore = create<AuthState>()(
  persist(authStoreCreator as any, {
    name: 'auth-storage',
    partialize: (state: AuthState) => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
    }),
  })
);