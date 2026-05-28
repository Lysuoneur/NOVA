/**
 * user.js — Zustand store for auth + profile + orders + wishlist.
 *
 * Auth is now handled by Firebase Auth.
 * Call initAuth() once on app mount; it sets up onAuthStateChanged and
 * returns the unsubscribe function for clean-up.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  getMe, getOrders, getWishlist,
  login, logout, register,
  toggleWishlist as toggleWishlistApi,
  updateProfile as updateProfileApi,
} from '../api';

const hydrateWishlist = (wishlistItems = []) =>
  wishlistItems.map(item => item.id ?? item.productId).filter(Boolean);

export const useUserStore = create(persist((set, get) => ({
  user:   null,
  token:  null,   // 'firebase-session' when signed in; kept for backwards compat
  orders: [],

  // ── Auth listener ────────────────────────────────────────────────────────

  /**
   * Set up Firebase onAuthStateChanged.
   * Call this once on app mount; return value is the unsubscribe function.
   */
  initAuth: () =>
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await getMe();
          if (userData?.id) {
            set({ user: { ...userData, wishlist: [] }, token: 'firebase-session' });
            await get().syncWishlist();
            await get().syncOrders();
          } else {
            // Profile missing — clear state (can happen if Firestore doc absent)
            set({ user: null, token: null, orders: [] });
          }
        } catch (err) {
          console.error('[nova] initAuth error:', err);
          set({ user: null, token: null, orders: [] });
        }
      } else {
        set({ user: null, token: null, orders: [] });
      }
    }),

  // ── Data sync ────────────────────────────────────────────────────────────

  syncWishlist: async () => {
    const current = get().user;
    if (!current) return [];
    try {
      const items    = await getWishlist();
      const wishlist = hydrateWishlist(items);
      set({ user: { ...current, wishlist } });
      return wishlist;
    } catch {
      return current.wishlist || [];
    }
  },

  syncOrders: async () => {
    try {
      const orders = await getOrders();
      set({ orders: orders || [] });
      return orders;
    } catch (err) {
      console.error('[nova] syncOrders failed:', err);
      return [];
    }
  },

  // ── Auth actions ─────────────────────────────────────────────────────────

  setUserDetails: (user) =>
    set({ user: { ...user, wishlist: user?.wishlist ?? [] } }),

  login: async (email, password) => {
    const res  = await login({ email, password });
    const user = { ...res.user, wishlist: [] };
    set({ user, token: res.token ?? 'firebase-session' });
    await get().syncWishlist();
    await get().syncOrders();
    return res;
  },

  register: async (name, email, password) => {
    const res  = await register({ name, email, password });
    const user = { ...res.user, wishlist: [] };
    set({ user, token: res.token ?? 'firebase-session' });
    await get().syncWishlist();
    await get().syncOrders();
    return res;
  },

  logout: async () => {
    await logout();
    set({ user: null, token: null, orders: [] });
  },

  /**
   * fetchMe — kept for any code that still calls it directly.
   * With Firebase Auth, initAuth() handles this automatically; this is a
   * manual trigger (e.g. after a profile update).
   */
  fetchMe: async () => {
    try {
      const res = await getMe();
      if (res?.id) {
        const current = get().user;
        set({ user: { ...res, wishlist: current?.wishlist ?? [] }, token: 'firebase-session' });
        return;
      }
      set({ user: null, token: null, orders: [] });
    } catch (err) {
      const msg = String(err?.message || '').toLowerCase();
      const isAuthError =
        msg.includes('401') || msg.includes('unauth') ||
        msg.includes('forbidden') || msg.includes('not-found');
      if (isAuthError) set({ user: null, token: null, orders: [] });
    }
  },

  // ── Wishlist ─────────────────────────────────────────────────────────────

  toggleWishlist: async (productId) => {
    const current = get().user;
    if (!current) return null;

    const res = await toggleWishlistApi(productId);

    if (res?.added) {
      const wishlist = Array.from(new Set([...(current.wishlist || []), productId]));
      set({ user: { ...current, wishlist } });
      return wishlist;
    }

    const wishlist = (current.wishlist || []).filter(id => id !== productId);
    set({ user: { ...current, wishlist } });
    return wishlist;
  },

  // ── Profile ──────────────────────────────────────────────────────────────

  updateProfile: async (data) => {
    const res = await updateProfileApi(data);
    if (res.id) {
      const current = get().user;
      set({ user: { ...current, ...res, wishlist: current?.wishlist || [] } });
    }
    return res;
  },
}), {
  name:       'nova-user',
  partialize: state => ({
    user:   state.user,
    token:  state.token,
    orders: state.orders,
  }),
}));
