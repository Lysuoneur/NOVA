/**
 * Firestore seed helper — populates brands and products from novaData.js
 *
 * Usage (one-time setup, run from the browser console after logging in as admin):
 *
 *   import('./firebase/seed').then(m => m.seedFirestore())
 *
 * Or trigger it from the DevTools console on any page:
 *
 *   window.__novaSeed()   ← registered below in development mode
 */
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { BRANDS, PRODUCTS } from '../data/novaData';

const log = (...args) => console.log('[NOVA seed]', ...args);

/** Seed brands from novaData.BRANDS */
export const seedBrands = async () => {
  log('Seeding brands…');
  for (const brand of BRANDS) {
    const ref = doc(db, 'brands', brand.id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      log(`  skip (exists): ${brand.name}`);
      continue;
    }
    // eslint-disable-next-line no-unused-vars
    const { size_chart, fitBias, fontStyle, ...rest } = brand;
    await setDoc(ref, { ...rest, isActive: true, createdAt: serverTimestamp() });
    log(`  ✓ ${brand.name}`);
  }
};

/** Seed products from novaData.PRODUCTS */
export const seedProducts = async () => {
  log('Seeding products…');
  for (const product of PRODUCTS) {
    // Build a stable document ID from SKU or brand+title slug
    const sku   = product.sku || product.SKU || product.code;
    const brand = String(product.brand || product.brand_name || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const title = String(product.title || product.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const docId = sku ? String(sku) : `${brand}-${title}`.replace(/-+/g, '-').replace(/^-|-$/g, '');

    const ref  = doc(db, 'products', docId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      log(`  skip (exists): ${product.title ?? product.name}`);
      continue;
    }

    // Strip React-unfriendly keys and normalise field names
    const { id: _id, SKU, code, ...rest } = product;
    await setDoc(ref, {
      ...rest,
      sku:       sku ?? null,
      title:     product.title ?? product.name ?? 'Untitled',
      brand:     product.brand ?? product.brand_name ?? 'NOVA',
      isActive:  true,
      createdAt: serverTimestamp(),
    });
    log(`  ✓ ${product.title ?? product.name}`);
  }
};

/** Seed both brands and products. */
export const seedFirestore = async () => {
  try {
    await seedBrands();
    await seedProducts();
    log('Done! Refresh the page to see your products.');
  } catch (err) {
    console.error('[NOVA seed] Error:', err);
    throw err;
  }
};

// Expose on window in dev mode for convenience
if (import.meta.env.DEV) {
  window.__novaSeed = seedFirestore;
  log('Dev mode: run window.__novaSeed() in the console to seed Firestore.');
}
