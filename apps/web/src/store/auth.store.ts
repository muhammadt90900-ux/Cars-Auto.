import { create } from 'zustand';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  verified: boolean;
  locale: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.auth.login({ email, password });
      localStorage.setItem('access_token', res.access_token);
      const user = await api.auth.me();
      set({ user, token: res.access_token });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.auth.register(data);
      localStorage.setItem('access_token', res.access_token);
      const user = await api.auth.me();
      set({ user, token: res.access_token });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },

  loadUser: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const user = await api.auth.me();
      set({ user, token });
    } catch {
      localStorage.removeItem('access_token');
      set({ user: null, token: null });
    }
  },
}));
