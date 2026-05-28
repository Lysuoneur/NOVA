/**
 * api.js — Firebase / Firestore implementation
 *
 * All exported names are identical to the original REST-based version so
 * every page and store can keep its existing imports unchanged.
 */

import { PRODUCTS as FALLBACK_PRODUCTS } from './data/novaData';
import { loginWithEmail, registerWithEmail, logoutUser, getCurrentUserProfile } from './firebase/auth';
import {
  fetchProducts, fetchProduct,
  createProduct as fbCreateProduct,
  updateProduct as fbUpdateProduct,
  deleteProduct as fbDeleteProduct,
  fetchOrders, createOrder, patchOrderStatus,
  fetchWishlist, toggleWishlistItem,
  updateUserProfile,
  fetchAdminStats, fetchAdminUsers, toggleUserBan, setUserRole,
} from './firebase/db';

// ── Image helpers (unchanged) ──────────────────────────────────────────────

const FALLBACK_IMAGE = 'https://placehold.co/400x530/f5f5f5/999?text=NOVA';

const BAD_IMAGE_URLS = new Set([
  'https://cdn.hstatic.net/products/1000306633/hades_coach_jacket.jpg',
  'https://cdn.hstatic.net/products/200001029438/cozy_crewneck_main.jpg',
  'https://cdn.hstatic.net/products/200001108456/gamble_cap_01.jpg',
  'https://cdn.hstatic.net/products/200001109034/NS_PATCH_HOODIE_1_1_1024x1024.jpg',
  'https://cdn.hstatic.net/products/1000307234/unkrush_denim_01.jpg',
  'https://cdn.hstatic.net/products/1000306633/untitled_capture1292_9ed8cfeb38304f8981a56e6032263d66.jpg',
  'https://cdn.hstatic.net/products/1000306633/170326hd0623_7aeffd91ed3743ef8becf6efc77f5f52.jpg',
]);

const FALLBACK_MIN_COUNT = 12;

export const getSafeImage = (image, fallback = FALLBACK_IMAGE) => {
  if (!image) return fallback;
  return BAD_IMAGE_URLS.has(image) ? fallback : image;
};

const getProductKey = (product = {}) => {
  const sku = product.sku || product.SKU || product.code;
  if (sku) return String(sku).trim().toLowerCase();

  const brand = (product.brand || product.brand_name || '').toString().trim().toLowerCase();
  const title = (product.title || product.name || '').toString().trim().toLowerCase();
  return `${brand}-${title}`.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

/** Normalise backend / Firestore product fields → frontend field names. */
export const normalizeProduct = (p = {}) => ({
  ...p,
  title:     p.title    ?? p.name       ?? 'Untitled Product',
  brand:     p.brand    ?? p.brand_name ?? 'NOVA',
  category:  p.category ?? 'Featured',
  price:     Number.isFinite(Number(p.price)) ? Number(p.price) : 0,
  compareAt: p.compareAt ?? p.compare_at ?? null,
  size:      Array.isArray(p.size) ? p.size : Array.isArray(p.sizes) ? p.sizes : [],
  badge:     p.badge ?? null,
  sku:       p.sku   ?? p.SKU ?? p.code ?? null,
  image:     getSafeImage(p.image),
});

// ── AUTH ───────────────────────────────────────────────────────────────────

export const login = ({ email, password }) =>
  loginWithEmail(email, password);

export const register = ({ name, email, password }) =>
  registerWithEmail(name, email, password);

export const logout = () => logoutUser();

export const getMe = () => getCurrentUserProfile();

// ── PRODUCTS ───────────────────────────────────────────────────────────────

/**
 * Returns active products from Firestore.
 * Falls back to / merges with novaData when Firestore has fewer than 12 items
 * (e.g. before the first seed run).
 */
export const getProducts = async (_params = {}) => {
  try {
    const list        = await fetchProducts();
    const apiProducts = list.map(normalizeProduct);

    if (apiProducts.length >= FALLBACK_MIN_COUNT) return apiProducts;

    // Merge with local fallback data until Firestore is seeded
    const fallbackProducts = FALLBACK_PRODUCTS.map(normalizeProduct);
    const seen = new Set(apiProducts.map(getProductKey).filter(Boolean));
    const merged = [...apiProducts];

    fallbackProducts.forEach(product => {
      const key = getProductKey(product);
      if (!key || seen.has(key)) return;
      seen.add(key);
      merged.push(product);
    });

    return merged;
  } catch {
    return FALLBACK_PRODUCTS.map(normalizeProduct);
  }
};

export const getProduct = (id) =>
  fetchProduct(id).then(normalizeProduct);

export const createProduct = (data) =>
  fbCreateProduct(data).then(normalizeProduct);

export const updateProduct = (id, data) =>
  fbUpdateProduct(id, data).then(normalizeProduct);

export const deleteProduct = (id) =>
  fbDeleteProduct(id);

// ── ORDERS ─────────────────────────────────────────────────────────────────

/**
 * Fetches orders from Firestore.
 * Admin users receive all orders; regular users receive only their own.
 */
export const getOrders = async (_params = {}) => {
  try {
    return await fetchOrders();
  } catch (error) {
    // Gracefully return empty on permission errors (e.g. logged-out)
    if (error?.code === 'permission-denied' || error?.status === 404) return [];
    throw error;
  }
};

export const placeOrder = (data) => createOrder(data);

export const updateOrderStatus = (id, data) => patchOrderStatus(id, data);

// ── WISHLIST ───────────────────────────────────────────────────────────────

export const getWishlist = () => fetchWishlist();

export const toggleWishlist = (productId) => toggleWishlistItem(productId);

// ── PROFILE ────────────────────────────────────────────────────────────────

export const updateProfile = (data) => updateUserProfile(data);

// ── ADMIN ──────────────────────────────────────────────────────────────────

// ── ADMIN ──────────────────────────────────────────────────────────────────

export const getAdminStats = () => fetchAdminStats();

export const getAdminUsers = () => fetchAdminUsers();

export const toggleBanUser = (id) => toggleUserBan(id);

export const updateUserRole = (id, role) => setUserRole(id, role);
