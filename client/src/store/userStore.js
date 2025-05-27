import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setUser: (userData) =>
        set((state) => ({
          ...state,
          user: userData,
        })),
      updateUser: (updates) =>
        set((state) => ({
          ...state,
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      setToken: (token) =>
        set((state) => ({
          ...state,
          token,
        })),
      getUser: () => get().user,

      getToken: () => get().token,

      isAuthenticated: () => {
        const { user, token } = get();
        return !!(user && token);
      },
    }),
    {
      name: "user-storage",
    }
  )
);
