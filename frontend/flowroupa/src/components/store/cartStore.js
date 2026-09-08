import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const idx = state.items.findIndex(
            (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
          );
          if (idx >= 0) {
            const items = [...state.items];
            items[idx].quantity += item.quantity || 1;
            return { items };
          }
          return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.productId === productId && i.size === size && i.color === color)),
        })),
      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size && i.color === color ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),
      clear: () => set({ items: [] }),
      total: () => {
        const { items } = get();
        return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
      count: () => {
        const { items } = get();
        return items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: 'flowstreat-cart' }
  )
);

export default useCartStore;
