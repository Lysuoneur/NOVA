# NOVA — Complete Project Documentation
# NOVA — ឯកសារគម្រោងពេញលេញ

> Bilingual Technical Documentation (English + ខ្មែរ)
> សម្រាប់ការបង្ហាញ និងការចែករំលែកចំណេះដឹងបច្ចេកទេស

---

## 1. What Is This Project?
## ១. គម្រោងនេះគឺជាអ្វី?

**NOVA** is a full-featured e-commerce web application for a Cambodian streetwear brand. Customers can browse products, add to cart, and pay using **Bakong KHQR** (Cambodia's national QR payment system) or Cash on Delivery. An admin dashboard allows the store owner to manage products, orders, and users.

**NOVA** គឺជា web application សម្រាប់លក់ទំនិញ streetwear របស់កម្ពុជា។ អតិថិជនអាចរកមើលផលិតផល បន្ថែមទៅ cart ហើយទូទាត់ប្រាក់ដោយប្រើ **Bakong KHQR** (ប្រព័ន្ធទូទាត់ QR ជាតិរបស់កម្ពុជា) ឬ Cash on Delivery។ Admin dashboard អនុញ្ញាតឱ្យម្ចាស់ហាងគ្រប់គ្រងផលិតផល កម្ម៉ង់ និងអ្នកប្រើប្រាស់។

---

## 2. Where Is the Code Stored?
## ២. កូដត្រូវបានរក្សាទុកនៅឯណា?

All source code is stored on **GitHub** — a cloud platform for version control and code collaboration.

កូដទាំងអស់ត្រូវបានរក្សាទុកនៅលើ **GitHub** — វេទិកា cloud សម្រាប់គ្រប់គ្រងកូដ និងសហការណ៍។

> 🔗 **Repository:** https://github.com/Lysuoneur/NOVA

### What GitHub gives us / អ្វីដែល GitHub ផ្តល់ឱ្យយើង:
- **Version history** — every change is tracked / ប្រវត្តិការផ្លាស់ប្តូរទាំងអស់ត្រូវបានតាមដាន
- **Backup** — code is safe in the cloud / កូដមានសុវត្ថិភាពនៅលើ cloud
- **Deployment trigger** — pushing code auto-deploys to Vercel / push កូដ auto-deploy ទៅ Vercel

---

## 3. Programming Languages Used
## ៣. ភាសាសរសេរកូដដែលប្រើ

### JavaScript (JSX) — Main Language / ភាសាសំខាន់
Every page, component, and logic is written in **JavaScript** using **JSX** syntax (JavaScript + HTML combined).

ទំព័រ component និង logic ទាំងអស់ត្រូវបានសរសេរជា **JavaScript** ដោយប្រើ syntax **JSX** (JavaScript + HTML រួមគ្នា)។

```jsx
// Example JSX / ឧទាហរណ៍ JSX
function ProductCard({ title, price }) {
  return (
    <div className="border p-4">
      <h2>{title}</h2>
      <p>${price}</p>
    </div>
  );
}
```

### CSS (via Tailwind) — Styling / រចនាប័ទ្ម
All visual styling is done with **Tailwind CSS** utility classes directly inside JSX — no separate `.css` files needed per component.

រចនាប័ទ្មទាំងអស់ត្រូវបានធ្វើដោយ **Tailwind CSS** classes នៅក្នុង JSX ដោយផ្ទាល់ — មិនត្រូវការឯកសារ `.css` ដាច់ដោយឡែកទេ។

```jsx
<button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800">
  Buy Now
</button>
```

### HTML — Entry Point / ចំណុចចូល
Only **one HTML file** exists (`index.html`) which is the entry point. React takes over from there.

មានតែ **ឯកសារ HTML មួយ** (`index.html`) ដែលជាចំណុចចូល។ React គ្រប់គ្រងពីចំណុចនោះតទៅ។

---

## 4. Project Structure — Where Everything Lives
## ៤. រចនាសម្ព័ន្ធគម្រោង — ទីតាំងនៃអ្វីៗទាំងអស់

```
NOVA/
│
├── src/                        # All application source code / កូដទាំងអស់
│   │
│   ├── pages/                  # One file per page / ឯកសារមួយក្នុងមួយទំព័រ
│   │   ├── Home.jsx            # Landing page / ទំព័រដើម
│   │   ├── Shop.jsx            # Product catalog / បញ្ជីផលិតផល
│   │   ├── Payment.jsx         # Checkout + KHQR / ការទូទាត់
│   │   ├── Profile.jsx         # User account / គណនីអ្នកប្រើ
│   │   ├── Auth.jsx            # Login / Register / ចូល / ចុះឈ្មោះ
│   │   ├── Wishlist.jsx        # Saved items / ទំនិញដែលបានរក្សា
│   │   └── Admin/              # Admin panel pages / ទំព័រ Admin
│   │       ├── Dashboard.jsx   # Stats overview / ទិដ្ឋភាពស្ថិតិ
│   │       ├── Products.jsx    # Manage products / គ្រប់គ្រងផលិតផល
│   │       ├── Orders.jsx      # Manage orders / គ្រប់គ្រងកម្ម៉ង់
│   │       └── Users.jsx       # Manage users / គ្រប់គ្រងអ្នកប្រើ
│   │
│   ├── components/             # Reusable UI pieces / ផ្នែក UI ដែលប្រើម្តងហើយម្តងទៀត
│   │   ├── CartDrawer.jsx      # Sliding cart sidebar / Cart ចំហៀង
│   │   ├── ProductCard.jsx     # Product display card / កាតផលិតផល
│   │   ├── ProductModal.jsx    # Product detail popup / Popup ព័ត៌មានផលិតផល
│   │   └── PaymentMap.jsx      # Delivery location map / ផែនទីទីតាំងដឹក
│   │
│   ├── firebase/               # Firebase connection layer / ស្រទាប់ Firebase
│   │   ├── config.js           # Firebase initialization / ការចាប់ផ្តើម Firebase
│   │   ├── auth.js             # Login / register functions / មុខងារ Login/Register
│   │   ├── db.js               # All Firestore database functions / មុខងារ database
│   │   └── seed.js             # Sample data loader / ផ្ទុកទិន្នន័យគំរូ
│   │
│   ├── store/                  # App-wide state (memory) / ស្ថានភាពទូទៅនៃ app
│   │   ├── cart.js             # Cart items + totals / ទំនិញ cart + សរុប
│   │   └── user.js             # Logged-in user + orders / អ្នកប្រើ + កម្ម៉ង់
│   │
│   ├── utils/                  # Helper functions / មុខងារជំនួយ
│   │   ├── format.js           # Money formatting / ការធ្វើទ្រង់ទ្រាយប្រាក់
│   │   └── khqr.js             # KHQR payment URL builder / បង្កើត URL ទូទាត់ KHQR
│   │
│   ├── data/
│   │   └── novaData.js         # Static products, brands, provinces / ទិន្នន័យថេរ
│   │
│   ├── styles/
│   │   └── globals.css         # Global CSS (fonts, custom cursor) / CSS សកល
│   │
│   └── App.jsx                 # Root component + Navbar / Component មូល + Navbar
│
├── public/                     # Static assets / ឯកសារស្ថិតិ
├── .env                        # Secret keys (not on GitHub) / កូដសម្ងាត់
├── index.html                  # App entry point / ចំណុចចូល app
├── package.json                # Dependencies list / បញ្ជី dependencies
├── vite.config.js              # Build configuration / ការកំណត់ build
├── tailwind.config.js          # Tailwind CSS config / ការកំណត់ Tailwind
└── vercel.json                 # Vercel deployment config / ការកំណត់ Vercel
```

---

## 5. Libraries & Tools Used
## ៥. បណ្ណាល័យ និងឧបករណ៍ដែលប្រើ

### Core Framework / Framework មូលដ្ឋាន

| Library | Purpose / គោលបំណង | Why we chose it / ហេតុអ្វីជ្រើសរើស |
|---------|-------------------|-------------------------------------|
| **React 18** | Build UI components / បង្កើត UI | Most popular, fast, reusable components |
| **Vite 8** | Build tool & dev server / ឧបករណ៍ build | Extremely fast hot reload |
| **React Router v7** | Page navigation / រុករកទំព័រ | Standard routing for React apps |

### Styling / រចនាប័ទ្ម

| Library | Purpose / គោលបំណង |
|---------|-------------------|
| **Tailwind CSS v3** | All UI styling / រចនាប័ទ្ម UI ទាំងអស់ |
| **Framer Motion** | Animations & transitions / រំជួលចលនា |
| **clsx / classnames** | Conditional CSS classes / class CSS មានលក្ខខណ្ឌ |

### State Management / ការគ្រប់គ្រងស្ថានភាព

| Library | Purpose / គោលបំណង |
|---------|-------------------|
| **Zustand v5** | Global state for cart & user / ស្ថានភាពសកលសម្រាប់ cart និងអ្នកប្រើ |

> **What is state management?** When you add an item to the cart on the Shop page, that cart data needs to be available on the Checkout page too. Zustand stores this data in memory and keeps it in sync across all pages.
>
> **ការគ្រប់គ្រងស្ថានភាពគឺជាអ្វី?** នៅពេលអ្នកបន្ថែមទំនិញទៅ cart នៅទំព័រ Shop ទិន្នន័យ cart នោះត្រូវការនៅទំព័រ Checkout ផងដែរ។ Zustand រក្សាទុកទិន្នន័យនេះក្នុង memory ហើយធ្វើឱ្យវាត្រូវគ្នានៅគ្រប់ទំព័រ។

### Data & Charts / ទិន្នន័យ និងក្រាហ្វ

| Library | Purpose / គោលបំណង |
|---------|-------------------|
| **Recharts** | Admin dashboard charts / ក្រាហ្វ Admin dashboard |
| **Dayjs** | Date formatting / ធ្វើទ្រង់ទ្រាយកាលបរិច្ឆេទ |
| **Swiper** | Product image carousel / ជួន image ផលិតផល |

### Map / ផែនទី

| Library | Purpose / គោលបំណង |
|---------|-------------------|
| **Leaflet + React-Leaflet v4** | Interactive delivery map / ផែនទីដឹកទំនិញ |
| **OpenStreetMap** | Free map tile provider / ផ្គត់ផ្គង់ tiles ផែនទីឥតគិតថ្លៃ |

---

## 6. Icons — Where Do They Come From?
## ៦. រូបភាព Icons — ពួកវាមកពីណា?

Icons in NOVA come from **two sources**:

Icons ក្នុង NOVA មកពី **ពីរប្រភព**:

### Source 1: Lucide React
A free, open-source icon library with 1000+ clean SVG icons installed as an npm package.

បណ្ណាល័យ icon ឥតគិតថ្លៃ open-source ដែលមាន icons SVG ស្អាតជាង 1000 ត្រូវបានដំឡើងជា npm package។

```jsx
import { ShoppingBag, Heart, User, Search } from "lucide-react";

<ShoppingBag size={20} />   // Cart icon in navbar
<Heart size={18} />          // Wishlist heart icon
<User size={16} />           // Profile icon
```

### Source 2: Inline SVG
Some icons are written directly as SVG code inside the JSX for full customisation.

Icons មួយចំនួនត្រូវបានសរសេរដោយផ្ទាល់ជាកូដ SVG ក្នុង JSX សម្រាប់ការប្តូរទំហំ/ពណ៌ពេញលេញ។

```jsx
// Custom arrow icon / Arrow icon ផ្ទាល់ខ្លួន
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path d="M5 12h14M12 5l7 7-7 7"/>
</svg>
```

---

## 7. Database — Firebase Firestore
## ៧. ទិន្នន័យ — Firebase Firestore

### What is Firestore? / Firestore គឺជាអ្វី?

**Firestore** is a **NoSQL cloud database** by Google (part of Firebase). Unlike traditional databases with tables and rows, Firestore stores data as **collections** and **documents** — like folders and files.

**Firestore** គឺជា **cloud database NoSQL** ដោយ Google (ផ្នែកមួយនៃ Firebase)។ មិនដូច database ប្រពៃណីដែលមាន tables និង rows Firestore រក្សាទុកទិន្នន័យជា **collections** និង **documents** — ដូចជា folders និង files។

> There is **no server** in this project. The app talks directly to Firestore from the browser.
> មិនមាន **server** ក្នុងគម្រោងនេះទេ។ app ទំនាក់ទំនងដោយផ្ទាល់ទៅ Firestore ពី browser។

### Database Structure / រចនាសម្ព័ន្ធទិន្នន័យ

```
Firestore Database
│
├── products/                   # All products / ផលិតផលទាំងអស់
│   └── {productId}
│       ├── title: "OO5 CD Waxed Camo Bomber"
│       ├── price: 250
│       ├── brand: "OO5"
│       ├── sizes: ["S", "M", "L", "XL"]
│       ├── image: "https://..."
│       └── isActive: true
│
├── orders/                     # All orders / កម្ម៉ង់ទាំងអស់
│   └── {orderId}
│       ├── userId: "abc123"
│       ├── orderNumber: "ORD-MP0ZA0EC"
│       ├── status: "processing"
│       ├── paymentMethod: "bakong"
│       ├── paymentStatus: "pending"
│       ├── total: 300.00
│       ├── items: [ { productId, productTitle, qty, size, price } ]
│       ├── shipping: { name, phone, city, line1, province }
│       └── createdAt: timestamp
│
├── users/                      # User profiles / គណនីអ្នកប្រើ
│   └── {userId}
│       ├── name: "Sen"
│       ├── email: "sen@gmail.com"
│       ├── role: "user"        # "user" or "admin"
│       └── wishlist/           # Sub-collection / sub-collection
│           └── {productId}
│
└── brands/                     # Brand list / បញ្ជីម៉ាក
    └── {brandId}
        ├── name: "OO5"
        └── logo: "https://..."
```

### Why Firestore? / ហេតុអ្វីជ្រើស Firestore?

| Benefit / អត្ថប្រយោជន៍ | Detail |
|----------------------|--------|
| **No server needed** / មិនត្រូវការ server | Saves cost and complexity / សន្សំថ្លៃ និងភាពស្មុគស្មាញ |
| **Real-time** | Data updates instantly / ទិន្នន័យធ្វើបច្ចុប្បន្នភាពភ្លាមៗ |
| **Free tier** / ជំហានឥតគិតថ្លៃ | Generous free quota / quota ឥតគិតថ្លៃដ៏ច្រើន |
| **Scalable** / អាចពង្រីក | Handles growth automatically / គ្រប់គ្រងការរីកចម្រើនដោយស្វ័យប្រវត្តិ |

---

## 8. Integrations
## ៨. ការភ្ជាប់ (Integrations)

This project has **3 major integrations**:
គម្រោងនេះមាន **ការភ្ជាប់ ៣ សំខាន់**:

---

### Integration 1: Firebase (Auth + Firestore)
### ការភ្ជាប់ទី ១: Firebase

**What it is / វាជាអ្វី:**
Firebase is Google's app development platform. We use two parts of it:
Firebase គឺជា platform អភិវឌ្ឍន៍ app របស់ Google។ យើងប្រើផ្នែកពីររបស់វា:

**Part A — Firebase Authentication (Login System)**
**ផ្នែក A — Firebase Authentication (ប្រព័ន្ធ Login)**

Handles all user login, registration, and session management. When a user logs in, Firebase gives them a secure token stored in the browser. When they close and reopen the browser, they stay logged in.

គ្រប់គ្រង login ចុះឈ្មោះ និងការគ្រប់គ្រង session របស់អ្នកប្រើ។ នៅពេលអ្នកប្រើ login Firebase ផ្តល់ token សុវត្ថិភាពដែលរក្សាទុកក្នុង browser។ នៅពេលពួកគេបិទ ហើយបើក browser ម្តងទៀត ពួកគេនៅតែ login ស្ថិតនៅ។

```
User enters email + password
        ↓
Firebase Auth verifies credentials
        ↓
Returns a secure user token
        ↓
App stores user in Zustand state
        ↓
User sees their profile / orders
```

**Part B — Firestore Database**
**ផ្នែក B — Firestore Database**

All products, orders, users, and wishlists are stored here. Every time a user places an order, the data is written to Firestore in real-time. Admins can see new orders instantly in the dashboard.

ផលិតផល កម្ម៉ង់ អ្នកប្រើ និង wishlists ទាំងអស់ត្រូវបានរក្សាទុកនៅទីនេះ។ រាល់ពេលអ្នកប្រើបញ្ជាទិញ ទិន្នន័យត្រូវបានសរសេរទៅ Firestore ភ្លាមៗ។ Admin អាចឃើញកម្ម៉ង់ថ្មីភ្លាមៗក្នុង dashboard។

**How it is set up / របៀបដំឡើងវា:**
- File: `src/firebase/config.js` — connects app to Firebase project using `.env` keys
- File: `src/firebase/auth.js` — login, register, logout functions
- File: `src/firebase/db.js` — all database read/write functions (products, orders, users)

---

### Integration 2: KHQRPay — Bakong Payment
### ការភ្ជាប់ទី ២: KHQRPay — ការទូទាត់ Bakong

**What it is / វាជាអ្វី:**
**KHQRPay** (khqr.cc) is a Cambodian payment gateway that generates **KHQR** codes — the official QR payment standard of the National Bank of Cambodia. Customers can scan the QR with ABA, Wing, Acleda, TrueMoney, or any KHQR-compatible app.

**KHQRPay** (khqr.cc) គឺជា payment gateway របស់កម្ពុជាដែលបង្កើត codes **KHQR** — ស្តង់ដារទូទាត់ QR ផ្លូវការរបស់ធនាគារជាតិនៃកម្ពុជា។ អតិថិជនអាចស្កែន QR ដោយ ABA, Wing, Acleda, TrueMoney ឬ app ផ្ទៀងផ្ទាត់ KHQR ណាមួយ។

**How it works / របៀបដំណើរការ:**

```
1. Customer fills shipping form + selects "Bakong QR"
   អតិថិជនបំពេញ shipping form + ជ្រើស "Bakong QR"
          ↓
2. App saves order to Firestore (status: pending)
   App រក្សាទុកកម្ម៉ង់ទៅ Firestore (ស្ថានភាព: pending)
          ↓
3. App builds a signed payment URL using:
   App បង្កើត URL ទូទាត់ signed ដោយប្រើ:
   - Order ID (as transaction reference)
   - Total amount
   - Secret key (SHA-1 hash for security)
          ↓
4. Customer is redirected to khqr.cc payment page
   អតិថិជនត្រូវបាន redirect ទៅទំព័រទូទាត់ khqr.cc
          ↓
5. Customer scans QR with their banking app
   អតិថិជនស្កែន QR ដោយ app ធនាគាររបស់ពួកគេ
          ↓
6. After payment, khqr.cc redirects back to /profile
   បន្ទាប់ពីទូទាត់ khqr.cc redirect ត្រឡប់ទៅ /profile
```

**Security — SHA-1 Hash / សុវត្ថិភាព:**
To prevent tampering, the payment URL is signed with a **SHA-1 hash**. This hash combines the secret key + order ID + amount + success URL. If anyone changes the amount, the hash becomes invalid and khqr.cc rejects the payment.

ដើម្បីការពារការផ្លាស់ប្តូរ URL ទូទាត់ត្រូវបាន signed ដោយ **SHA-1 hash**។ hash នេះរួមបញ្ចូល secret key + order ID + amount + success URL។ ប្រសិនបើនរណាម្នាក់ផ្លាស់ប្តូរចំនួនទឹកប្រាក់ hash ក្លាយជាមិនត្រឹមត្រូវ ហើយ khqr.cc បដិសេធការទូទាត់។

**Files involved / ឯកសារដែលពាក់ព័ន្ធ:**
- `src/utils/khqr.js` — builds the signed payment URL / បង្កើត URL ទូទាត់ signed
- `src/pages/Payment.jsx` — checkout page with KHQR option / ទំព័រ checkout ជាមួយ KHQR
- `src/pages/Profile.jsx` — retry payment button for unpaid orders / ប៊ូតុង retry ទូទាត់

**Credentials needed / Credentials ដែលត្រូវការ:**
- `VITE_KHQR_PROFILE_ID` — your merchant profile ID on khqr.cc
- `VITE_KHQR_SECRET_KEY` — your secret signing key from khqr.cc

---

### Integration 3: Vercel — Deployment Platform
### ការភ្ជាប់ទី ៣: Vercel — Platform ដាក់ចូលប្រើ

**What it is / វាជាអ្វី:**
**Vercel** hosts the built React app on the internet so anyone can access it via a public URL. It connects directly to GitHub — every time code is pushed to the `main` branch, Vercel automatically rebuilds and redeploys the site within ~1 minute.

**Vercel** ប្រើប្រាស់ React app ដែលបាន build នៅលើអ៊ីនធឺណិត ដូច្នេះអ្នកណាមួយអាចចូលប្រើវាតាម URL សាធារណៈ។ វាភ្ជាប់ដោយផ្ទាល់ទៅ GitHub — រាល់ពេលដែលកូដត្រូវបាន push ទៅ branch `main` Vercel ស្ថាបនា និង deploy វិញដោយស្វ័យប្រវត្តិក្នុងរយៈពេល ~១ នាទី។

**How it works / របៀបដំណើរការ:**

```
Developer pushes code to GitHub
អ្នកអភិវឌ្ឍន៍ push កូដទៅ GitHub
        ↓
Vercel detects new commit
Vercel រកឃើញ commit ថ្មី
        ↓
Vercel runs "npm run build"
Vercel run "npm run build"
        ↓
Vite compiles React → static HTML/JS/CSS files
Vite compile React → ឯកសារ HTML/JS/CSS ស្ថិតិ
        ↓
Files uploaded to Vercel's global CDN
ឯកសារត្រូវបាន upload ទៅ CDN សកលរបស់ Vercel
        ↓
Live at nova-xxx.vercel.app (worldwide)
Live នៅ nova-xxx.vercel.app (ទូទាំងពិភពលោក)
```

**The `vercel.json` config / ការកំណត់ `vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
> The `rewrites` rule ensures page refresh works correctly for React Router (SPA routing).
> quy tắc `rewrites` ធានាថា page refresh ដំណើរការត្រឹមត្រូវសម្រាប់ React Router។

---

## 9. How the App Works — Full Flow
## ៩. App ដំណើរការដោយរបៀបណា — Flow ពេញលេញ

```
Browser loads nova-xxx.vercel.app
        ↓
Vite-built JS bundle downloads to browser
        ↓
React mounts — checks Firebase Auth for existing session
        ↓
If logged in → load user profile + orders from Firestore
If not logged in → show as guest (can still browse & add to cart)
        ↓
User browses /shop → products loaded from Firestore
        ↓
User adds to cart → stored in Zustand (browser memory + localStorage)
        ↓
User goes to /pay → fills shipping → clicks "Pay with KHQR"
        ↓
Order saved to Firestore → redirect to khqr.cc → user scans QR
        ↓
After payment → redirected to /profile → order shows as paid
```

---

## 10. Security Summary
## ១០. សង្ខេបសុវត្ថិភាព

| Area / ផ្នែក | How it's secured / របៀបការពារ |
|-------------|-------------------------------|
| **Login** | Firebase Auth — industry standard, encrypted passwords |
| **Database rules** | Firestore Security Rules — users can only read/write their own data |
| **Payment** | SHA-1 signed URLs — tamper-proof amount |
| **Secret keys** | Stored in `.env` — never committed to GitHub |
| **Admin access** | Role-based — only `role: "admin"` users can access `/admin` |

---

## 11. Quick Reference
## ១១. ឯកសារយោងរហ័ស

| What / អ្វី | Where / ទីណា |
|------------|-------------|
| Source code / កូដ | https://github.com/Lysuoneur/NOVA |
| Database | Firebase Firestore (console.firebase.google.com) |
| Payment dashboard | https://khqr.cc |
| Deployment | https://vercel.com |
| Icons | Lucide React + custom SVG |
| `.env` file | DM `visalsen72@gmail.com` |

---

*NOVA — Built with ❤️ for Cambodia 🇰🇭*
