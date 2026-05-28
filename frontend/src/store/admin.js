/**
 * admin.js — Lightweight local-state store for the admin panel.
 *
 * All persistent data (products, orders, users) now lives in Firestore and
 * is fetched directly by each admin page via api.js.  This store only holds
 * the in-memory list that the admin UI renders so it can do optimistic
 * updates without refetching.
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAdminStore = create(devtools((set, get) => ({
  products: [],
  orders:   [],

  // Products
  setProducts:   (ps)         => set({ products: ps }),
  addProduct:    (p)          => set({ products: [{ ...p, id: p.id ?? Date.now().toString() }, ...get().products] }),
  updateProduct: (id, patch)  => set({ products: get().products.map(p => p.id === id ? { ...p, ...patch } : p) }),
  deleteProduct: (id)         => set({ products: get().products.filter(p => p.id !== id) }),

  // Orders
  setOrders:      (os)         => set({ orders: os }),
  addOrder:       (o)          => set({ orders: [o, ...get().orders] }),
  setOrderStatus: (id, status) => set({ orders: get().orders.map(o => o.id === id ? { ...o, status } : o) }),
})));
