import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      updateQty: (id, qty) => set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
      })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'food101-cart' }
  )
);