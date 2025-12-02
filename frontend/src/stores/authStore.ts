import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser, AdminRole } from '@/types/user.types';

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;

  // Actions
  login: (user: AdminUser, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<AdminUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: (user, token) => set({ user, token, isLoading: false }),

      logout: () => set({ user: null, token: null, isLoading: false }),

      setLoading: (isLoading) => set({ isLoading }),

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);