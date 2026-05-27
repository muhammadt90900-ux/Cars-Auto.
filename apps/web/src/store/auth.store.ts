// apps/web/src/store/auth.store.ts
// Optimised: no localStorage for access tokens (security); token lives in memory via api.ts.
// Zustand persist is used ONLY for the user profile (non-sensitive).

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi, setAccessToken, getAccessToken, type AuthUser } from '@/lib/api';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login({ email, password });
          set({ user: res.user });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authApi.register(data);
          set({ user: res.user });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await authApi.logout();
        set({ user: null });
      },

      loadUser: async () => {
        // Only refetch if we have an access token in memory
        if (!getAccessToken()) return;
        try {
          const user = await authApi.me();
          set({ user });
        } catch {
          setAccessToken(null);
          set({ user: null });
        }
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist non-sensitive user profile data
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
