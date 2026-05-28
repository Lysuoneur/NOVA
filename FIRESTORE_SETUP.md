# NOVA — Firestore Setup Guide

The backend is now **Firebase / Firestore** — no Laravel, no SQLite, no Express server.

---

## 1. Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → give it a name (e.g. `nova-store`)
3. Disable Google Analytics if you don't need it → **Create project**

---

## 2. Enable Authentication (Email/Password)

1. In the Firebase Console, go to **Authentication → Sign-in method**
2. Enable **Email/Password**
3. Click **Save**

---

## 3. Enable Firestore

1. Go to **Firestore Database → Create database**
2. Start in **production mode** (you'll add rules below)
3. Choose a region close to your users (e.g. `asia-southeast1` for Cambodia)

---

## 4. Get the Firebase Config

1. Go to **Project Settings** (gear icon) → **Your apps**
2. Click **Add app → Web** → register the app
3. Copy the `firebaseConfig` object — it looks like:

```js
const firebaseConfig = {
  apiKey:            "AIza...",
  authDomain:        "nova-store.firebaseapp.com",
  projectId:         "nova-store",
  storageBucket:     "nova-store.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123",
};
```

4. Paste the values into `frontend/.env.local`:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=nova-store.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nova-store
VITE_FIREBASE_STORAGE_BUCKET=nova-store.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## 5. Firestore Security Rules

Paste these rules in **Firestore → Rules** and click **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper: is the requester an admin?
    function isAdmin() {
      return request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // ── Products — public read, admin write ──────────────────────────────
    match /products/{productId} {
      allow read:  if true;
      allow write: if isAdmin();
    }

    // ── Brands — public read, admin write ───────────────────────────────
    match /brands/{brandId} {
      allow read:  if true;
      allow write: if isAdmin();
    }

    // ── Users ────────────────────────────────────────────────────────────
    match /users/{userId} {
      // Own document or admin
      allow read:   if request.auth != null &&
                       (request.auth.uid == userId || isAdmin());
      // Only the account owner can create their own doc (on register)
      allow create: if request.auth != null && request.auth.uid == userId;
      // Own updates + admin can update role/banned
      allow update: if request.auth != null &&
                       (request.auth.uid == userId || isAdmin());

      // ── Wishlist subcollection — own only ──
      match /wishlist/{productId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // ── Orders ───────────────────────────────────────────────────────────
    match /orders/{orderId} {
      // Own orders or admin can read
      allow read:   if request.auth != null &&
                       (resource.data.userId == request.auth.uid || isAdmin());
      // Any authenticated user can create an order
      allow create: if request.auth != null;
      // Only admin can update status / payment_status
      allow update: if isAdmin();
    }

  }
}
```

---

## 6. Seed Initial Data (Products + Brands)

Once you have the Firebase config in `.env.local` and `npm run dev` is running:

1. Open the app in the browser and **log in or register** (any account)
2. Open **DevTools Console**
3. Run:

```js
window.__novaSeed()
```

This will upload all products and brands from `src/data/novaData.js` to Firestore.
It skips documents that already exist, so it is safe to run multiple times.

---

## 7. Create the Admin Account

1. **Register** a new account via `/auth` with the email you want as admin
   (e.g. `admin@nova.com` / any password)
2. In the Firebase Console → **Firestore → users collection**
3. Find the document with your admin email
4. Edit the `role` field → set it to `"admin"`

From that point on, any user with `role: "admin"` in Firestore gets full admin access.

> **Tip:** you can also make any existing user an admin from the Admin → Users panel
> once you have at least one admin account.

---

## 8. Data Structure

```
Firestore
├── products/{docId}
│   ├── title, brand, category, price, compareAt
│   ├── badge, image, sku, stock
│   ├── sizes: ["S","M","L"]
│   └── isActive: true
│
├── brands/{id}
│   └── name, shortName, logo, origin, tier, …
│
├── users/{uid}          ← uid = Firebase Auth UID
│   ├── displayName, email
│   ├── role: "user" | "admin"
│   ├── banned: false
│   ├── phone, address
│   └── wishlist/{productId}
│       └── productId, addedAt
│
└── orders/{docId}
    ├── userId, userEmail, orderNumber
    ├── status: "processing" | "shipped" | "delivered" | "cancelled"
    ├── paymentMethod: "visa" | "cod"
    ├── paymentStatus: "unpaid" | "paid" | "refunded"
    ├── items: [{ productId, productTitle, qty, size, price }]
    ├── subtotal, total
    ├── shipping: { name, phone, city, province, line1, latitude, longitude }
    └── createdAt
```

---

## 9. What Was Removed

| Was | Now |
|-----|-----|
| Laravel 12 + PHP backend | ❌ Not needed |
| `server.js` (Express + better-sqlite3) | ❌ Not needed |
| `nova.db` (SQLite file) | ❌ Not needed |
| Bearer token in localStorage | ✅ Firebase Auth session (auto-persisted) |
| `VITE_API_URL` env var | ✅ Firebase config vars |

The `server.js` file is still present but **no longer started or needed**.

---

## 10. Local Development

```bash
cd frontend
npm install
npm run dev
```

No backend server required. The app talks directly to Firestore.

---

## 11. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `FirebaseError: Missing or insufficient permissions` | Check Firestore rules are published and user is logged in |
| Products page empty (before seed) | Run `window.__novaSeed()` in the console |
| Admin panel shows 0 orders/users | Ensure you're logged in as a user with `role: "admin"` |
| `auth/invalid-api-key` | Double-check `.env.local` values match the Firebase console |
| Composite index error in console | Follow the link Firebase provides to create the required index |
