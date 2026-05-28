/**
 * Firestore data layer — replaces all SQLite / Laravel API calls.
 *
 * Collections
 * ───────────
 *  products/{id}
 *  brands/{id}
 *  users/{uid}
 *    └── wishlist/{productId}
 *  orders/{id}
 */
import {
  collection, doc,
  getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc,
  query, where, serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './config';

// Current user UID (undefined when logged out)
const uid = () => auth.currentUser?.uid;

// ── Normalisation ──────────────────────────────────────────────────────────

/**
 * Normalise a raw Firestore order document into the field shape the UI expects.
 * Frontend expects snake_case: order_number, user_email, payment_method, etc.
 */
const normalizeOrder = (id, data = {}) => ({
  id,
  order_number:    data.orderNumber    ?? id.slice(-6).toUpperCase(),
  user_email:      data.userEmail      ?? '',
  userId:          data.userId         ?? '',
  status:          data.status         ?? 'pending',
  payment_method:  data.paymentMethod  ?? 'cod',
  payment_status:  data.paymentStatus  ?? 'unpaid',
  total:           data.total          ?? 0,
  subtotal:        data.subtotal       ?? 0,
  items: (data.items ?? []).map(i => ({
    ...i,
    product_title: i.productTitle ?? i.title ?? '',
  })),
  shipping:        data.shipping       ?? {},
  createdAt:       data.createdAt,
});

// ── PRODUCTS ───────────────────────────────────────────────────────────────

/** Return all active products. */
export const fetchProducts = async () => {
  const q = query(collection(db, 'products'), where('isActive', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/** Return one product by its Firestore document ID. */
export const fetchProduct = async (id) => {
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) throw Object.assign(new Error('Product not found'), { status: 404 });
  return { id: snap.id, ...snap.data() };
};

/** Create a new product document; returns the created product with its new ID. */
export const createProduct = async (data) => {
  const ref = await addDoc(collection(db, 'products'), {
    ...data,
    isActive:  data.active ?? data.isActive ?? true,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...data, isActive: true };
};

/** Partial-update a product; returns the updated document. */
export const updateProduct = async (id, data) => {
  const ref = doc(db, 'products', id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
};

/** Permanently delete a product. */
export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, 'products', id));
};

// ── ORDERS ─────────────────────────────────────────────────────────────────

/**
 * Fetch orders.
 *  • Admin users  → all orders in the collection
 *  • Regular users → only their own orders
 * Results are sorted newest-first client-side to avoid composite-index
 * requirements in Firestore.
 */
export const fetchOrders = async () => {
  const currentUid = uid();
  if (!currentUid) return [];

  // Check role
  const userSnap = await getDoc(doc(db, 'users', currentUid));
  const role = userSnap.exists() ? (userSnap.data().role ?? 'user') : 'user';

  let snap;
  if (role === 'admin') {
    snap = await getDocs(collection(db, 'orders'));
  } else {
    const q = query(collection(db, 'orders'), where('userId', '==', currentUid));
    snap = await getDocs(q);
  }

  const orders = snap.docs.map(d => normalizeOrder(d.id, d.data()));

  // Sort newest-first using the Firestore Timestamp seconds field
  return orders.sort((a, b) => {
    const at = a.createdAt?.seconds ?? 0;
    const bt = b.createdAt?.seconds ?? 0;
    return bt - at;
  });
};

/** Place a new order; returns { id, order_number }. */
export const createOrder = async (orderData) => {
  const currentUid = uid();
  const userEmail  = auth.currentUser?.email ?? '';
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

  const ref = await addDoc(collection(db, 'orders'), {
    userId:        currentUid,
    userEmail,
    orderNumber,
    status:        'processing',
    paymentStatus: orderData.payment_status ?? 'unpaid',
    paymentMethod: orderData.payment_method ?? 'cod',
    items: (orderData.items ?? []).map(i => ({
      productId:    i.product_id   ?? i.productId   ?? null,
      productTitle: i.product_title ?? i.title        ?? '',
      qty:          i.quantity     ?? i.qty           ?? 1,
      size:         i.size         ?? null,
      price:        i.price        ?? 0,
    })),
    subtotal: orderData.subtotal ?? 0,
    total:    orderData.total    ?? 0,
    shipping: {
      name:      orderData.ship_name  ?? orderData.name     ?? '',
      phone:     orderData.ship_phone ?? orderData.phone    ?? '',
      city:      orderData.ship_city  ?? orderData.city     ?? '',
      province:  orderData.ship_province ?? orderData.province ?? '',
      line1:     orderData.ship_line1 ?? orderData.line1    ?? '',
      latitude:  orderData.latitude   ?? null,
      longitude: orderData.longitude  ?? null,
    },
    createdAt: serverTimestamp(),
  });

  return { id: ref.id, order_number: orderNumber };
};

/** Update status / payment_status on an order; returns the normalised order. */
export const patchOrderStatus = async (id, patch) => {
  const ref  = doc(db, 'orders', id);

  // Map snake_case fields the UI sends → camelCase stored in Firestore
  const update = {};
  if (patch.status         !== undefined) update.status        = patch.status;
  if (patch.payment_status !== undefined) update.paymentStatus = patch.payment_status;
  update.updatedAt = serverTimestamp();

  await updateDoc(ref, update);
  const snap = await getDoc(ref);
  return normalizeOrder(snap.id, snap.data());
};

// ── WISHLIST ───────────────────────────────────────────────────────────────

/** Return the current user's wishlist as [{ id: productId }, …]. */
export const fetchWishlist = async () => {
  const currentUid = uid();
  if (!currentUid) return [];
  const snap = await getDocs(collection(db, 'users', currentUid, 'wishlist'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/**
 * Toggle a product in the wishlist.
 * Returns { added: true } when added, { added: false } when removed.
 */
export const toggleWishlistItem = async (productId) => {
  const currentUid = uid();
  if (!currentUid) throw new Error('Not authenticated');

  const ref  = doc(db, 'users', currentUid, 'wishlist', String(productId));
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await deleteDoc(ref);
    return { added: false };
  }

  await setDoc(ref, { productId: String(productId), addedAt: serverTimestamp() });
  return { added: true };
};

// ── PROFILE ────────────────────────────────────────────────────────────────

/** Partial-update the current user's Firestore profile; returns the user shape. */
export const updateUserProfile = async (data) => {
  const currentUid = uid();
  if (!currentUid) throw new Error('Not authenticated');

  const ref    = doc(db, 'users', currentUid);
  const update = { updatedAt: serverTimestamp() };

  if (data.name    !== undefined) update.displayName = data.name;
  if (data.phone   !== undefined) update.phone       = data.phone;
  if (data.address !== undefined) update.address     = data.address;

  await updateDoc(ref, update);

  const snap    = await getDoc(ref);
  const profile = snap.data();

  return {
    id:      currentUid,
    name:    profile.displayName ?? auth.currentUser?.email?.split('@')[0] ?? 'User',
    email:   auth.currentUser?.email ?? '',
    role:    profile.role    ?? 'user',
    banned:  profile.banned  ?? false,
    phone:   profile.phone   ?? null,
    address: profile.address ?? null,
  };
};

// ── ADMIN ──────────────────────────────────────────────────────────────────

/** Compute dashboard stats by aggregating the orders collection. */
export const fetchAdminStats = async () => {
  const snap   = await getDocs(collection(db, 'orders'));
  const orders = snap.docs.map(d => d.data());

  const revenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total ?? 0), 0);

  return {
    revenue_total: revenue,
    total_orders:  orders.length,
    processing:    orders.filter(o => o.status === 'processing').length,
    shipped:       orders.filter(o => o.status === 'shipped').length,
    delivered:     orders.filter(o => o.status === 'delivered').length,
    cancelled:     orders.filter(o => o.status === 'cancelled').length,
  };
};

/**
 * Return all users with a computed orders_count.
 * Shape: { id, name, email, role, banned, orders_count }
 */
export const fetchAdminUsers = async () => {
  const [usersSnap, ordersSnap] = await Promise.all([
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'orders')),
  ]);

  // Count orders per userId
  const orderCounts = {};
  ordersSnap.docs.forEach(d => {
    const { userId } = d.data();
    if (userId) orderCounts[userId] = (orderCounts[userId] ?? 0) + 1;
  });

  return usersSnap.docs.map(d => {
    const data = d.data();
    return {
      id:           d.id,
      name:         data.displayName ?? data.email?.split('@')[0] ?? 'User',
      email:        data.email       ?? '',
      role:         data.role        ?? 'user',
      banned:       data.banned      ?? false,
      orders_count: orderCounts[d.id] ?? 0,
    };
  });
};

/** Toggle a user's banned flag; returns the updated user. */
export const toggleUserBan = async (id) => {
  const ref  = doc(db, 'users', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('User not found');

  const newBanned = !snap.data().banned;
  await updateDoc(ref, { banned: newBanned, updatedAt: serverTimestamp() });

  const updated = await getDoc(ref);
  const data    = updated.data();
  return {
    id,
    name:   data.displayName ?? data.email?.split('@')[0] ?? 'User',
    email:  data.email       ?? '',
    role:   data.role        ?? 'user',
    banned: data.banned      ?? false,
  };
};

/** Update a user's role; returns the updated user. */
export const setUserRole = async (id, role) => {
  const ref = doc(db, 'users', id);
  await updateDoc(ref, { role, updatedAt: serverTimestamp() });

  const snap = await getDoc(ref);
  const data = snap.data();
  return {
    id,
    name:   data.displayName ?? data.email?.split('@')[0] ?? 'User',
    email:  data.email       ?? '',
    role:   data.role        ?? 'user',
    banned: data.banned      ?? false,
  };
};
