import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getOrders, getSafeImage } from "../api";
import { useUserStore } from "../store/user";
import { money } from "../utils/format";

const STATUS_STYLE = {
  pending:    "bg-gray-100 text-gray-600",
  processing: "bg-amber-100 text-amber-700",
  shipped:    "bg-blue-100 text-blue-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

export default function Orders() {
  const user = useUserStore((s) => s.user);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchParams] = useSearchParams();
  const justPlaced = searchParams.get("placed") === "1";

  React.useEffect(() => {
    if (!user) return;

    let mounted = true;

    getOrders()
      .then((result) => {
        if (!mounted) return;
        setOrders(Array.isArray(result) ? result : []);
      })
      .catch(() => {
        if (!mounted) return;
        setOrders([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-5 py-24 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="font-display text-3xl mb-2">Sign in to view orders</h2>
        <p className="text-sm text-black/50 mb-6">You need an account to track your orders.</p>
        <Link to="/auth" className="nova-pill solid px-6 py-3 text-sm">Sign In →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl">My Orders</h1>
        <p className="text-sm text-black/45 mt-1 font-mono">{user.email}</p>
      </div>

      {justPlaced && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <div className="font-semibold text-green-800">Order placed successfully!</div>
            <div className="text-sm text-green-600">We'll update you when it ships.</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-black/5 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 text-black/30">
          <div className="text-5xl mb-4">📦</div>
          <div className="font-display text-2xl mb-2">No orders yet</div>
          <div className="text-sm mb-6">Time to treat yourself.</div>
          <Link to="/shop" className="nova-pill solid text-sm px-6 py-3">Shop now →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-black/[0.08] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="font-mono text-xs text-black/40 mb-1">{new Date(o.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
                  <div className="font-semibold">{o.order_number}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-bold ${STATUS_STYLE[o.status] || "bg-black/5 text-black/50"}`}>
                    {o.status}
                  </span>
                  <div className="font-bold text-right">{money(o.total)}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-3 border-t border-black/[0.06]">
                {o.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <img
                      src={getSafeImage(item.product_image)}
                      alt={item.product_title}
                      className="w-10 h-10 object-cover rounded-lg bg-black/5"
                      onError={(e) => { e.target.src = "https://placehold.co/80x96/f5f5f5/999?text=?"; }}
                    />
                    <div>
                      <div className="font-medium text-xs">{item.product_title}</div>
                      <div className="text-[10px] text-black/40 font-mono">
                        {item.size && `Size ${item.size} · `}Qty {item.qty} · {money(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs text-black/40 font-mono">
                <span>
                  {o.ship_name} · {o.ship_city}
                </span>
                <span className="uppercase">{o.payment_method} · {o.payment_status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
