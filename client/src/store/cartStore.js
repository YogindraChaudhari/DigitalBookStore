import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./userStore";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      userId: null,
      addToCart: (item) => {
        const { user } = useUserStore.getState();
        if (!user) return;
        const existing = get().cart.find((i) => i._id === item._id);
        const updatedCart = existing
          ? get().cart.map((i) =>
              i._id === item._id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
            )
          : [...get().cart, { ...item, quantity: 1 }];
        set({ cart: updatedCart, userId: user._id });
      },
      removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((i) => i._id !== id) })),

      // Add this updateQuantity action
      updateQuantity: (itemId, newQuantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === itemId
              ? { ...item, quantity: Math.max(1, newQuantity) } // Ensures quantity doesn't go below 1
              : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),
      syncUserCart: () => {
        const { user } = useUserStore.getState();
        if (get().userId !== user?._id)
          set({ cart: [], userId: user?._id || null });
      },
    }),
    { name: "cart-storage" }
  )
);
