# NOVA — Project Setup Guide
# NOVA — មគ្គុទ្ទេសក៍រៀបចំគម្រោង

> **For presentation preparation / សម្រាប់រៀបចំការបង្ហាញ**

---

## Prerequisites / តម្រូវការមុននឹងចាប់ផ្តើម

Before starting, make sure you have installed:
មុននឹងចាប់ផ្តើម សូមប្រាកដថាអ្នកបានដំឡើងរួចហើយ៖

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18 or higher / v18 ឬខ្ពស់ជាងនេះ | [nodejs.org](https://nodejs.org) |
| **Git** | Latest / ថ្មីបំផុត | [git-scm.com](https://git-scm.com) |
| **VS Code** *(recommended)* | Latest | [code.visualstudio.com](https://code.visualstudio.com) |

To verify installation / ដើម្បីពិនិត្យការដំឡើង:
```bash
node -v
npm -v
git -v
```

---

## Step 1 — Clone the Repository
## ជំហានទី ១ — ទាញយកកូដ

```bash
git clone https://github.com/Lysuoneur/NOVA.git
cd NOVA
```

> This downloads the full project to your computer.
> នេះនឹងទាញយកគម្រោងទាំងមូលមកកាន់កុំព្យូទ័ររបស់អ្នក។

---

## Step 2 — Install Dependencies
## ជំហានទី ២ — ដំឡើង Dependencies

```bash
npm install
```

> This installs all required packages. Wait until it completes (may take 1–2 minutes).
> នេះនឹងដំឡើង packages ទាំងអស់ដែលត្រូវការ។ សូមរង់ចាំរហូតដល់វាបញ្ចប់ (អាចចំណាយពេល ១–២ នាទី)។

---

## Step 3 — Set Up Environment File (.env)
## ជំហានទី ៣ — រៀបចំ Environment File (.env)

The `.env` file contains secret keys for Firebase and KHQRPay.
This file is **not included** in the repository for security reasons.

ឯកសារ `.env` មានកូដសម្ងាត់សម្រាប់ Firebase និង KHQRPay។
ឯកសារនេះ **មិនត្រូវបានដាក់** ក្នុង repository ដោយសារហេតុផលសុវត្ថិភាព។

### How to get it / របៀបទទួលបានវា

> 📧 **DM / ទំនាក់ទំនង: `visalsen72@gmail.com`**

Once you receive the file / បន្ទាប់ពីទទួលបានឯកសារ:

1. Place the `.env` file in the **root folder** of the project
   ដាក់ឯកសារ `.env` នៅក្នុង **folder មេ** នៃគម្រោង

2. It should look like this / វាគួរតែមើលទៅដូចនេះ:

```
NOVA/
├── src/
├── public/
├── .env          ← place it here / ដាក់ត្រង់នេះ
├── package.json
└── vite.config.js
```

The file contains / ឯកសារនោះមាន:
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

---

## Step 4 — Run the App
## ជំហានទី ៤ — បើកដំណើរការ App

```bash
npm run dev
```

Then open your browser and go to / បន្ទាប់មកបើក browser ហើយចូលទៅ:

```
http://localhost:5173
```

> ✅ You should see the NOVA storefront homepage.
> ✅ អ្នកគួរតែឃើញទំព័រដើមនៃ NOVA storefront។

---

## Step 5 — Test Accounts
## ជំហានទី ៥ — គណនីសម្រាប់សាកល្បង

### Admin Account / គណនីអ្នកគ្រប់គ្រង
| Field | Value |
|-------|-------|
| Email | `admin@nova.com` |
| Password | `password` |
| Access | Full admin dashboard / Dashboard ពេញលេញ |

### Regular User / អ្នកប្រើប្រាស់ធម្មតា
| Field | Value |
|-------|-------|
| Email | `user@nova.com` |
| Password | `password` |
| Access | Shop, profile, orders / ហាង, គណនី, កម្ម៉ង់ |

> Or register a new account at `/auth`
> ឬចុះឈ្មោះគណនីថ្មីនៅ `/auth`

---

## Step 6 — Key Pages to Demo
## ជំហានទី ៦ — ទំព័រសំខាន់ៗសម្រាប់បង្ហាញ

| URL | Description | ការពណ៌នា |
|-----|-------------|-----------|
| `/` | Homepage | ទំព័រដើម |
| `/shop` | Product catalog | បញ្ជីផលិតផល |
| `/pay` | Checkout + KHQR payment | ការទូទាត់ + KHQR |
| `/profile` | User orders & wishlist | កម្ម៉ង់ និង wishlist |
| `/admin` | Admin dashboard | Dashboard អ្នកគ្រប់គ្រង |

---

## Deploy to Production (Vercel)
## ដាក់ឱ្យដំណើរការជាផ្លូវការ (Vercel)

### Step 1 / ជំហានទី ១
Go to [vercel.com](https://vercel.com) → Sign in with GitHub
ចូលទៅ [vercel.com](https://vercel.com) → ចូលដោយប្រើ GitHub

### Step 2 / ជំហានទី ២
Click **Add New Project** → Import `Lysuoneur/NOVA`
ចុច **Add New Project** → Import `Lysuoneur/NOVA`

### Step 3 / ជំហានទី ៣
Add all 8 environment variables from your `.env` under **Environment Variables**
បន្ថែម environment variables ទាំង ៨ ពី `.env` ក្រោម **Environment Variables**

### Step 4 / ជំហានទី ៤
Click **Deploy** and wait ~1 minute
ចុច **Deploy** ហើយរង់ចាំ ~១ នាទី

### Step 5 / ជំហានទី ៥
Add your Vercel URL to Firebase Auth authorized domains:
បន្ថែម Vercel URL របស់អ្នកទៅ Firebase Auth authorized domains:

> Firebase Console → Authentication → Settings → Authorized domains → Add your `xxx.vercel.app`

---

## Troubleshooting / ការដោះស្រាយបញ្ហា

| Problem / បញ្ហា | Solution / ដំណោះស្រាយ |
|----------------|----------------------|
| `vite not found` | Run `npm install` first / run `npm install` ជាមុន |
| Blank white page / ទំព័រទទេ | Check `.env` file is in root folder / ពិនិត្យ `.env` នៅក្នុង root folder |
| Firebase login fails / Login Firebase មិនបាន | Contact `visalsen72@gmail.com` for correct `.env` |
| `npm run dev` doesn't start | Make sure you are in the `NOVA/` folder / ប្រាកដថាអ្នកនៅក្នុង folder `NOVA/` |

---

## Contact / ទំនាក់ទំនង

For `.env` file or any setup help:
សម្រាប់ឯកសារ `.env` ឬជំនួយក្នុងការដំឡើង:

📧 **visalsen72@gmail.com**

---

*NOVA — Streetwear Cambodia 🇰🇭*
