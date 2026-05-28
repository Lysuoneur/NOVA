import React from "react";
import { Link, Navigate } from "react-router-dom";
import { getSafeImage, getProducts } from "../api";
import { useCartStore } from "../store/cart";
import { useUserStore } from "../store/user";
import { money } from "../utils/format";
import { buildKHQRPayURL } from "../utils/khqr";

const STATUS_COLOR = {
  "Delivered":  "bg-stone-100 text-stone-800 border-stone-300",
  "Processing": "bg-neutral-100 text-neutral-800 border-neutral-300 font-bold animate-pulse",
  "Shipped":    "bg-black text-white border-black",
  "Cancelled":  "bg-red-50 text-red-700 border-red-200 line-through",
};

function formatOrderDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date((ts.seconds ?? 0) * 1000);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function Profile() {
  const user           = useUserStore((s) => s.user);
  const orders         = useUserStore((s) => s.orders);
  const isAdmin        = user?.role === "admin" || user?.email === "admin@nova.com";

  if (isAdmin) return <Navigate to="/admin" replace />;
  const logout         = useUserStore((s) => s.logout);
  const toggleWishlist = useUserStore((s) => s.toggleWishlist);
  const addToCart      = useCartStore((s) => s.add);
  const [tab, setTab]       = React.useState("orders");
  const [retrying, setRetrying] = React.useState(null);
  const [allProducts, setAllProducts] = React.useState([]);

  React.useEffect(() => {
    getProducts().then(setAllProducts).catch(() => {});
  }, []);

  const retryPayment = async (order) => {
    setRetrying(order.id);
    try {
      const payUrl = await buildKHQRPayURL({
        transactionId: order.id,
        amount:        order.total,
        successUrl:    `${window.location.origin}/profile`,
        remark:        "NOVA Order",
      });
      window.location.href = payUrl;
    } catch {
      alert("Could not build payment URL. Please try again.");
      setRetrying(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-5 py-32 text-center relative">
        <div className="absolute inset-0 grid-lines-bg opacity-[0.1] pointer-events-none" />
        <div className="relative z-10 space-y-6 max-w-md mx-auto p-8 border border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-black/40">// IDENTIFICATION UNRESOLVED</div>
          <h2 className="font-display text-4xl tracking-tighter uppercase">ANONYMOUS CLIENT</h2>
          <p className="text-sm text-black/50 leading-relaxed font-sans">Please initialize your session to safely fetch personal data archives.</p>
          <Link to="/auth" className="inline-block bg-black text-white font-mono text-xs uppercase tracking-widest px-8 py-3.5 font-bold hover:bg-black/80 transition-colors w-full">
            CONNECT GATEWAY →
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "orders",   label: "ORDER ARCHIVE",    count: orders?.length       || 0 },
    { id: "wishlist", label: "SAVED ARCHETYPES", count: user.wishlist?.length || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 py-16 text-black bg-white min-h-screen relative">
      <div className="absolute inset-0 grid-lines-bg opacity-[0.12] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between border-b-2 border-black pb-8 mb-12 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-black rotate-45" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/40 font-bold">AUTHORIZED OPERATIONS PANEL</span>
          </div>
          <h1 className="font-display text-6xl tracking-tighter uppercase">
            WLM, <span className="font-serif italic font-light lowercase text-black/40 pr-2">{user.name}</span>
          </h1>
          <div className="font-mono text-[10px] text-black/50 uppercase tracking-wider">
            UID REF: {user.email} // CORE ACCOUNT ACTIVE
          </div>
        </div>
        <button onClick={logout}
          className="font-mono text-xs uppercase tracking-widest border border-black/30 hover:border-black hover:bg-black hover:text-white px-5 py-2.5 transition-all">
          DISCONNECT // LOGOUT
        </button>
      </div>

      {/* Main layout */}
      <div className="relative z-10 grid lg:grid-cols-[1fr,360px] gap-10 items-start">

        {/* Left — tabs */}
        <div className="space-y-8">
          <div className="flex border-b border-black/10 gap-6">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`pb-3 font-mono text-xs tracking-widest font-bold uppercase transition-all relative
                  ${tab === t.id ? "text-black border-b-2 border-black" : "text-black/30 hover:text-black"}`}>
                {t.label}
                {t.count != null && <span className="text-[10px] font-normal text-black/40 ml-1">({t.count})</span>}
              </button>
            ))}
          </div>

          {/* Orders */}
          {tab === "orders" && (
            <div className="space-y-4">
              {!orders || orders.length === 0 ? (
                <div className="border border-dashed border-black/20 p-12 text-center text-sm font-mono text-black/30 uppercase tracking-wider">
                  No active tracking pipelines discovered.
                </div>
              ) : (
                orders.map((order) => {
                  const statusKey = order.status
                    ? order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()
                    : "";
                  return (
                    <div key={order.id} className="border border-black p-6 bg-white shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-4 mb-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs uppercase tracking-widest font-extrabold block">REF_ID: #{order.order_number || order.id}</span>
                          <span className="font-mono text-[10px] text-black/40 block">TIMESTAMP: {formatOrderDate(order.createdAt)}</span>
                        </div>
                        <span className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 border ${STATUS_COLOR[statusKey] || "bg-white border-black/10 text-black/50"}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="divide-y divide-black/[0.04]">
                        {order.items.map((item, idx) => {
                          const product = PRODUCTS.find((p) => p.id === item.productId);
                          const title   = item.product_title || item.productTitle || (product ? product.name : null) || `Item ${idx + 1}`;
                          return (
                            <div key={idx} className="py-3 flex items-center justify-between gap-4 text-sm">
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-stone-100 font-mono text-xs flex items-center justify-center border border-black/5">×{item.qty}</span>
                                <div>
                                  <span className="font-medium tracking-tight block">{title}</span>
                                  {item.size && <span className="font-mono text-[10px] text-black/40 uppercase">SIZE: {item.size}</span>}
                                </div>
                              </div>
                              <span className="font-mono text-xs font-bold text-black/70">{money((item.price ?? 0) * (item.qty ?? 1))}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="border-t border-black/5 pt-4 mt-4 flex justify-between items-center font-mono text-xs">
                        <span className="text-black/40 uppercase tracking-wider font-bold">Aggregate Value:</span>
                        <span className="font-extrabold text-sm border-b border-black pb-0.5">{money(order.total)}</span>
                      </div>

                      {/* Payment status row */}
                      <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-black/40 font-bold">Payment:</span>
                          {order.payment_status === "paid" ? (
                            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-700">PAID</span>
                          ) : order.payment_method === "cod" ? (
                            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-stone-50 border border-stone-300 text-stone-500">PAY ON DELIVERY</span>
                          ) : (
                            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-amber-50 border border-amber-300 text-amber-700 animate-pulse">UNPAID · BAKONG</span>
                          )}
                        </div>
                        {order.payment_status !== "paid" && order.payment_method === "bakong" && (
                          <button
                            onClick={() => retryPayment(order)}
                            disabled={retrying === order.id}
                            className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 bg-black text-white hover:bg-black/80 disabled:opacity-50 transition-colors">
                            {retrying === order.id ? "Redirecting…" : "Complete Payment →"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Wishlist */}
          {tab === "wishlist" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {!user.wishlist || user.wishlist.length === 0 ? (
                <div className="col-span-full border border-dashed border-black/20 p-12 text-center text-sm font-mono text-black/30 uppercase tracking-wider">
                  Wishlist index matrix remains vacant.
                </div>
              ) : (
                user.wishlist.map((id) => {
                  const product = allProducts.find((p) => p.id === id);
                  if (!product) return null;
                  return (
                    <div key={product.id} className="border border-black p-4 bg-white flex flex-col justify-between group">
                      <div className="flex gap-4">
                        <img src={getSafeImage(product.image)} alt="" className="w-16 h-20 object-cover bg-stone-100 border border-black/5" />
                        <div className="space-y-1">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-black/40 block font-bold">{product.brand}</span>
                          <Link to={`/product/${product.id}`} className="font-display text-lg uppercase tracking-tight block hover:underline">{product.name}</Link>
                          <span className="font-mono text-xs font-bold text-black/60">{money(product.price)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-black/5">
                        <button onClick={() => addToCart(product, product.sizes?.[0] || "M", 1)}
                          className="bg-black text-white py-2 font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-black/80">
                          + BAG
                        </button>
                        <button onClick={() => toggleWishlist(product.id)}
                          className="border border-black/20 text-black/50 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-black hover:text-black">
                          REMOVE
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Right — account info */}
        <div className="space-y-6">
          <div className="border border-black p-6 bg-white shadow-sm">
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold border-b border-black pb-3 mb-4">// PROFILE PARAMETERS</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-black/40 font-bold block">CLIENT ACCOUNT NAME</span>
                <input className="w-full bg-stone-50 border border-black/10 p-2.5 text-xs text-black/60 rounded-none cursor-not-allowed" value={user.name} disabled />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-black/40 font-bold block">ROUTING ENDPOINT ADDR</span>
                <input className="w-full bg-stone-50 border border-black/10 p-2.5 text-xs text-black/60 rounded-none cursor-not-allowed" value={user.email} disabled />
              </div>
              <div className="text-[10px] font-mono text-black/35 uppercase leading-snug">
                📝 Variables are protected in read-only mode during demo cycles.
              </div>
            </div>
          </div>

          <div className="border border-black p-6 bg-white shadow-sm">
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold border-b border-black pb-3 mb-4">// PREFERENCE TOGGLES</h3>
            <div className="space-y-4 text-xs font-mono tracking-wide">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-black/60 group-hover:text-black font-medium uppercase">AUTOMATED MAIL STREAM</span>
                <div className="w-8 h-4 bg-black rounded-none relative">
                  <div className="w-3 h-3 bg-white rounded-none absolute right-0.5 top-0.5" />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-black/60 group-hover:text-black font-medium uppercase">NEW DROP BROADCASTS</span>
                <div className="w-8 h-4 bg-black/10 rounded-none relative">
                  <div className="w-3 h-3 bg-white rounded-none absolute left-0.5 top-0.5" />
                </div>
              </label>
            </div>
          </div>

          <div className="border border-red-200 p-6 bg-white shadow-sm">
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-red-600 border-b border-red-100 pb-3 mb-2">⚠️ CRITICAL DATA ZONE</h3>
            <p className="text-[11px] text-black/50 mb-4 font-sans leading-relaxed">
              Purging identity caches removes transaction references permanently.
            </p>
            <button onClick={logout}
              className="w-full border border-red-200 text-red-600 py-2.5 font-mono text-xs uppercase tracking-widest font-bold hover:bg-red-50 transition-colors">
              PURGE OPERATIVE TOKEN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
