import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useCartStore = create(devtools(persist((set, get) => ({
    open: false,
    items: [],
    setOpen: (v) => set({ open: v }),
    add: (product, size = "M", qty = 1) => {
        const items = [...get().items];
        const id = product.id;
        const idx = items.findIndex(i => i.id === id && i.size === size);
        if (idx >= 0) {
            items[idx] = { ...items[idx], qty: items[idx].qty + qty };
        } else {
            items.push({
                id,
                size,
                qty,
                price:    product.price,
                title:    product.title ?? product.name,
                brand:    product.brand,
                image:    product.image,
                badge:    product.badge,
            });
        }
        set({ items, open: true });
    },
    remove: (id, size) => set({ items: get().items.filter(i => !(i.id === id && i.size === size)) }),
    setQty: (id, size, qty) => set({ items: get().items.map(i => (i.id === id && i.size === size ? { ...i, qty: Math.max(1, qty) } : i)) }),
    clear: () => set({ items: [] }),
    subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
}), {
    name: "nova-cart",
    partialize: (state) => ({ items: state.items }),
})));

