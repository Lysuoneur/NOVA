import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useCartStore } from "./store/cart";

const Home = lazy(() => import("./pages/Home.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));
const Payment = lazy(() => import("./pages/Payment.jsx"));
const Auth = lazy(() => import("./pages/Auth.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const CartDrawer = lazy(() => import("./components/CartDrawer.jsx"));
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard.jsx"));
const AdminProducts = lazy(() => import("./pages/Admin/Products.jsx"));
const AdminOrders = lazy(() => import("./pages/Admin/Orders.jsx"));
const AdminUsers = lazy(() => import("./pages/Admin/Users.jsx"));
const DatabaseView = lazy(() => import("./pages/DatabaseView.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-sm text-black/45 font-mono">
      Loading route...
    </div>
  );
}

export default function RoutesIndex() {
  const open = useCartStore(s => s.open);
  return (
    <>
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/pay" element={<Payment />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/db" element={<DatabaseView />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <CartDrawer open={open} />
      </Suspense>
    </>
  );
}