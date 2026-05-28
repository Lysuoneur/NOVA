# NOVA Frontend-Backend Integration Guide

## Overview

This guide documents the complete frontend-backend integration for the NOVA e-commerce application. The backend is built with **Laravel 12** and the frontend with **React + Vite**, using **token-based authentication** via Sanctum and **Zustand** for state management.

---

## Architecture

### Backend (Laravel)
- **Server**: `http://127.0.0.1:8000`
- **API Base**: `http://127.0.0.1:8000/api`
- **Auth**: Laravel Sanctum (token-based)
- **Database**: SQLite (default)
- **Middleware**: Custom `admin` and `banned` aliases

### Frontend (React + Vite)
- **Dev Server**: `http://localhost:5175` (configurable)
- **Build Tool**: Vite
- **State**: Zustand stores
- **API Client**: Centralized `src/api.js` wrapper

---

## Environment Configuration

### Frontend

#### Development (`.env.local` or `.env`)
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

#### Production (`.env.production`)
```env
VITE_API_URL=https://api.nova.com/api
```

### Backend

#### Development (`.env`)
```env
APP_URL=http://127.0.0.1:8000
APP_DEBUG=true
DB_CONNECTION=sqlite
FRONTEND_URL=http://localhost:5175
```

#### Production (`.env.production`)
```env
APP_URL=https://api.nova.com
APP_DEBUG=false
FRONTEND_URL=https://nova.com
```

---

## API Integration Flow

### 1. **Authentication**

**Login/Register Flow:**
1. Frontend calls `/api/login` or `/api/register`
2. Backend returns `token` and `user` object
3. Frontend stores token in `localStorage`
4. All subsequent requests include `Authorization: Bearer <token>` header

**Implementation:**
- `frontend/src/api.js`: `authHeaders()` function adds token to all requests
- `frontend/src/store/user.js`: `login()`, `register()`, `fetchMe()` methods handle auth lifecycle
- `my-laravel-app/app/Http/Controllers/AuthController.php`: Backend auth logic

---

### 2. **Product Management**

**Public Routes (No Auth Required):**
- `GET /products` — List all products (pagination available)
- `GET /products/{id}` — Get single product with details

**Admin Routes (Auth + Admin Middleware):**
- `POST /products` — Create new product
- `PUT /products/{id}` — Update product (including badge/status)
- `DELETE /products/{id}` — Delete product

**Frontend Integration:**
- `frontend/src/pages/Admin/Products.jsx` — Loads products from `getProducts()` and calls `createProduct()`, `updateProduct()`, `deleteProduct()`
- All mutations refresh the product list immediately
- Product normalization: `normalizeProduct()` in `api.js` handles field name differences (e.g., `name` vs `title`, `compare_at` vs `compareAt`)

---

### 3. **Order Management**

**Order Creation (Authenticated):**
- `POST /orders` — Create new order
  - Payload:
    ```json
    {
      "payment_method": "visa" | "cod",
      "items": [
        { "product_id": 1, "quantity": 2, "size": "M", "price": 29.99 }
      ],
      "ship_name": "John Doe",
      "phone": "+855 12 345 678",
      "city": "Phnom Penh",
      "province": "Phnom Penh",
      "line1": "123 Main St",
      "latitude": 11.5564,
      "longitude": 104.9282
    }
    ```

**Order Retrieval:**
- `GET /orders` — List user's orders
- Includes order items, totals, payment method, and shipping details

**Order Status Update (Admin Only):**
- `PATCH /orders/{id}/status` — Update order status (processing, shipped, delivered, cancelled)

**Frontend Integration:**
- `frontend/src/pages/Payment.jsx` — Calls `placeOrder()` and syncs via `useUserStore.syncOrders()`
- `frontend/src/store/user.js` — `syncOrders()` fetches orders from `/api/orders` and stores in `orders` array
- `frontend/src/pages/Admin/Orders.jsx` — Loads orders and allows status updates via `updateOrderStatus()`

---

### 4. **Wishlist Management**

**Wishlist Operations (Authenticated):**
- `GET /wishlist` — Get user's wishlist (returns array of wishlist items with product details)
- `POST /wishlist/{productId}` — Toggle product in wishlist (add/remove)

**Frontend Integration:**
- `frontend/src/store/user.js` — `syncWishlist()` syncs wishlist to `user.wishlist` array
- `toggleWishlist(productId)` adds/removes product ID from local state and syncs via API
- `frontend/src/pages/Wishlist.jsx` — Displays wishlist items

---

### 5. **User Profile**

**Profile Operations (Authenticated):**
- `GET /me` — Get current user's profile
- `PATCH /profile` — Update profile (name, email, phone, address, etc.)

**Frontend Integration:**
- `frontend/src/store/user.js` — `fetchMe()` hydrates user on app load, `updateProfile()` patches profile
- User state is persisted in Zustand and synced with wishlist/orders on login

---

### 6. **Admin Dashboard**

**Admin Routes:**
- `GET /admin/stats` — Dashboard statistics (revenue, order counts, product counts)
- `GET /admin/users` — List all users (for ban management)
- `PATCH /admin/users/{id}/ban` — Toggle user ban status
- `PATCH /admin/users/{id}/role` — Update user role

**Frontend Integration:**
- `frontend/src/pages/Admin/Dashboard.jsx` — Calls `getAdminStats()` and `getOrders()` to display real-time dashboard data
- All data loads from backend; **no mock data used**

---

## State Management

### Zustand Stores

#### `frontend/src/store/user.js`
```javascript
{
  user: { id, name, email, phone, address, wishlist: [...] },
  token: "Bearer token...",
  orders: [ { id, items, total, status, ... } ],
  
  // Methods
  login(email, password)
  register(name, email, password)
  logout()
  fetchMe()
  syncWishlist()
  syncOrders()
  toggleWishlist(productId)
  updateProfile(data)
}
```

#### `frontend/src/store/cart.js`
```javascript
{
  items: [ { id, title, size, qty, price, image } ],
  
  // Methods
  add(product, size, qty)
  remove(productId, size)
  update(productId, size, qty)
  clear()
  subtotal() // computed
}
```

#### `frontend/src/store/admin.js`
```javascript
{
  products: [ /* legacy mock data, now from API */ ],
  orders: [ /* legacy mock data, now from API */ ],
  
  // Methods
  addProduct(p)
  updateProduct(id, patch)
  deleteProduct(id)
  addOrder(o)
  setOrderStatus(id, status)
}
```

**Note**: `admin.js` is used only for local UI state mutations during the session. All data comes from the backend API.

---

## Request Flow Diagram

```
Frontend (React)
    ↓
api.js (request wrapper)
    ↓ (adds Authorization header)
Backend (Laravel API)
    ↓ (Sanctum auth middleware)
AuthController / OrderController / etc.
    ↓
Database (SQLite)
```

---

## Error Handling

### Frontend
- All API calls use `try/catch` to handle failures
- Error messages are displayed to users via `alert()` or toast notifications
- Failed requests throw `Error` with `message` property from backend or HTTP status

### Backend
- All controllers return JSON responses with `message` and `errors` fields
- HTTP status codes: 200 (success), 422 (validation error), 401 (unauthorized), 403 (forbidden), 500 (server error)
- Middleware validates auth and admin status before controller logic runs

---

## Checkout Flow

1. **User adds items to cart** → stored in `useCartStore`
2. **User navigates to Payment page** → `Payment.jsx` renders
3. **User fills shipping and payment details**
4. **User clicks "Pay" or "Place Order"** → `onPay()` handler:
   - Validates form data
   - Calls `placeOrder()` with payload
   - Backend creates order and returns order ID
   - Frontend calls `syncOrders()` to fetch all user orders
   - Cart is cleared via `clear()`
   - User is notified of success

---

## Admin Panel Flow

1. **Admin logs in** → `fetchMe()` syncs user and calls `syncOrders()`
2. **Admin navigates to Dashboard** → `Dashboard.jsx` calls `getAdminStats()` and `getOrders()` on mount
3. **Admin navigates to Products** → `Products.jsx` loads all products and allows CRUD:
   - **Add**: POST `/products`
   - **Update**: PUT `/products/{id}`
   - **Delete**: DELETE `/products/{id}`
4. **Admin navigates to Orders** → `Orders.jsx` shows all orders with status filter and update:
   - **Change Status**: PATCH `/orders/{id}/status`

---

## CORS Configuration

### Dev (allows localhost and 127.0.0.1)
```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
],
```

### Production (uses env variable)
```php
'allowed_origins' => array_filter([
    'https://nova.com',
    env('FRONTEND_URL'),
]),
```

Add `FRONTEND_URL=https://nova.com` to production `.env`.

---

## Token Storage & Security

### Current Implementation (For Development)
- Token stored in `localStorage`
- Sent as `Authorization: Bearer <token>` header

### Production Recommendations
1. Store token in **httpOnly cookie** instead of localStorage
2. Implement **CSRF protection** (Laravel Sanctum handles this)
3. Add **token refresh** endpoint to rotate tokens
4. Implement **rate limiting** on auth endpoints
5. Use **HTTPS only** for all API calls

---

## Testing Checklist

- [ ] Register new user
- [ ] Login existing user
- [ ] Add product to cart and place order
- [ ] Update profile
- [ ] Add/remove items from wishlist
- [ ] Admin: Create product
- [ ] Admin: Update product badge
- [ ] Admin: Delete product
- [ ] Admin: Change order status
- [ ] Admin: View dashboard stats

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is in `config/cors.php`
- Check dev server is running on configured port (default 5175)

### 401 Unauthorized
- Token is missing or expired
- Check `localStorage` for token
- Re-login if needed

### 422 Validation Error
- Check request payload fields match backend validation rules
- Backend returns `errors` object with field-level messages

### 500 Server Error
- Check Laravel logs: `storage/logs/laravel.log`
- Ensure database is properly migrated: `php artisan migrate`

---

## Future Improvements

1. **Image Upload**: Add multipart form data handling for product images
2. **Payment Integration**: Integrate Stripe or PayPal for real payment processing
3. **Email Notifications**: Send order confirmations and status updates
4. **Search & Filtering**: Full-text search and advanced product filters
5. **Analytics**: Track user behavior and sales metrics
6. **Caching**: Implement Redis caching for products and orders
7. **Real-time Updates**: Use WebSockets for live order status and chat support

---

## Contact & Support

For issues or questions, refer to the backend API documentation or frontend component source code.
