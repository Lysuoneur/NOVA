# NOVA — Streetwear Cambodia

A modern e-commerce storefront built with React + Vite, Firebase/Firestore, and Bakong KHQR payment integration.

---

## Tech Stack

- **Frontend** — React 18, Vite, Tailwind CSS
- **Backend** — Firebase Auth + Firestore (no server)
- **Payment** — Bakong KHQR via khqr.cc
- **Deployment** — Vercel

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Lysuoneur/NOVA.git
cd NOVA
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

This project requires a `.env` file with Firebase and KHQRPay credentials.

> **DM `visalsen72@gmail.com` to get the `.env` file.**

Once you have it, place the `.env` file in the root of the project (same level as `package.json`).

It should contain:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_KHQR_PROFILE_ID=...
VITE_KHQR_SECRET_KEY=...
```

### 4. Run in development

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Deploy to Production (Vercel)

### Option A — Vercel Dashboard (recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → import `Lysuoneur/NOVA`
3. Vercel auto-detects Vite — no build settings needed
4. Under **Environment Variables**, add all 8 keys from your `.env`
5. Click **Deploy**

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

Follow the prompts and add your environment variables when asked.

---

### After Deploying

Add your Vercel domain to Firebase Auth's allowed list:

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Add your Vercel URL (e.g. `nova-xxx.vercel.app`)

Every push to `main` triggers an automatic re-deploy on Vercel.

---

## Project Structure

```
├── src/
│   ├── pages/          # Route pages (Home, Shop, Payment, Profile, Admin)
│   ├── components/     # Shared UI components
│   ├── firebase/       # Firebase config, auth, Firestore functions
│   ├── store/          # Zustand state (cart, user)
│   ├── utils/          # Helpers (format, KHQR)
│   └── data/           # Static product/brand data
├── public/
├── .env                # not committed — DM to get
├── vite.config.js
└── vercel.json
```

---

## Contact

For environment variables or questions — **visalsen72@gmail.com**
