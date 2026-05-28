import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSafeImage, placeOrder } from "../api";
import { CAMBODIA_PROVINCES, PAYMENT } from "../data/novaData";
import { useCartStore } from "../store/cart";
import { useUserStore } from "../store/user";
import { money } from "../utils/format";
import { buildKHQRPayURL } from "../utils/khqr";

// ── Checkout form ──────────────────────────────────────────────────────────
function PaymentForm() {
  const items      = useCartStore((s) => s.items);
  const subtotal   = useCartStore((s) => s.subtotal)();
  const clear      = useCartStore((s) => s.clear);
  const user       = useUserStore((s) => s.user);
  const syncOrders = useUserStore((s) => s.syncOrders);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [method,       setMethod]       = useState("bakong");
  const [done,         setDone]         = useState(false);

  const [form, setForm] = useState({
    ship_name: user?.name || "",
    phone: "", line1: "", city: "",
    province: "Phnom Penh",
  });

  useEffect(() => {
    setForm((f) => ({ ...f, ship_name: user?.name || f.ship_name }));
  }, [user]);

  const shipping = subtotal > 50 ? 0 : 3.99;
  const total    = subtotal + shipping;
  const f        = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const onPay = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await placeOrder({
        payment_method: method,
        payment_status: method === "cod" ? "unpaid" : "pending",
        items:      items.map(({ id, title, size, qty, price }) => ({ product_id: id, product_title: title, size, qty, price })),
        ship_name:  form.ship_name,
        ship_phone: form.phone,
        ship_city:  form.city,
        ship_line1: form.line1,
        total,
        subtotal,
      });

      await syncOrders();
      clear();

      if (method === "bakong") {
        const orderId    = result?.id ?? result?.order_number ?? `ORD-${Date.now()}`;
        const successUrl = `${window.location.origin}/profile`;
        const payUrl     = await buildKHQRPayURL({
          transactionId: orderId,
          amount:        total,
          successUrl,
          remark:        `NOVA Order`,
        });
        window.location.href = payUrl;
      } else {
        setDone(true);
      }
    } catch (err) {
      alert("Order failed: " + err.message);
      setIsSubmitting(false);
    }
  };

  // ── Success (COD only — bakong redirects away) ───────────────────────────
  if (done) {
    return (
      <div className="max-w-md mx-auto px-5 py-32 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="font-display text-4xl tracking-tight">Order Placed!</h2>
        <p className="text-sm text-black/50">Pay on delivery when it arrives.</p>
        <Link to="/profile" className="inline-block bg-black text-white font-mono text-xs uppercase tracking-widest px-8 py-3.5 hover:bg-black/80 transition-colors">
          View Orders →
        </Link>
      </div>
    );
  }

  // ── Empty cart ───────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-5 py-32 text-center">
        <div className="text-4xl mb-4">🛍️</div>
        <h2 className="font-display text-3xl mb-2">Your bag is empty</h2>
        <p className="text-sm text-black/50 mb-6">Add items before checking out.</p>
        <Link to="/shop" className="inline-block bg-black text-white font-mono text-xs uppercase tracking-widest px-8 py-3.5">
          Shop Now →
        </Link>
      </div>
    );
  }

  const enabledMethods = PAYMENT.methods.filter((m) => m.enabled);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">

      {/* ── Left — payment + shipping ── */}
      <section className="space-y-6">
        <h2 className="font-display text-3xl">Checkout</h2>

        {/* Payment method selector */}
        <div>
          <div className="text-sm font-medium mb-2">Payment method</div>
          <div className="flex gap-2">
            {enabledMethods.map((m) => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={`px-4 py-1.5 rounded-full border text-sm font-mono transition-colors
                  ${method === m.id
                    ? "bg-black text-white border-black"
                    : "border-black/20 text-black/60 hover:border-black"}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bakong info banner */}
        {method === "bakong" && (
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" className="mt-0.5 flex-shrink-0">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <div>
              <div className="text-xs font-mono font-bold text-blue-800 uppercase tracking-wider">Bakong / KHQR</div>
              <div className="text-xs text-blue-700 mt-0.5">
                You'll be redirected to the secure KHQR payment page to scan and pay.
              </div>
            </div>
          </div>
        )}

        {/* Shipping form */}
        <form onSubmit={onPay} className="space-y-3">
          <h3 className="font-semibold text-sm">Shipping Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <input className="border border-black/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
              placeholder="Full name" value={form.ship_name} onChange={f("ship_name")} required />
            <input className="border border-black/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
              placeholder="Phone (+855…)" value={form.phone} onChange={f("phone")} required />
            <input className="col-span-2 border border-black/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
              placeholder="Address" value={form.line1} onChange={f("line1")} required />
            <input className="border border-black/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
              placeholder="City" value={form.city} onChange={f("city")} required />
            <select className="border border-black/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
              value={form.province} onChange={f("province")}>
              {CAMBODIA_PROVINCES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          <button
            className="w-full mt-2 px-4 py-3.5 bg-black text-white rounded-xl font-mono text-sm font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-black/80 transition-colors"
            disabled={isSubmitting}>
            {isSubmitting
              ? "Redirecting to payment…"
              : method === "cod"
                ? `Place Order (COD) · ${money(total)}`
                : `Pay with KHQR · ${money(total)}`}
          </button>
        </form>
      </section>

      {/* ── Right — order summary ── */}
      <aside>
        <h3 className="font-display text-2xl mb-4">Order Summary</h3>
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id + i.size} className="flex items-center gap-3 border border-black/10 rounded-xl p-2">
              <img src={getSafeImage(i.image, "https://placehold.co/80x96/f5f5f5/999?text=?")}
                alt={i.title} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <div className="text-sm font-medium">{i.title}</div>
                <div className="text-xs text-black/50">Size {i.size} · Qty {i.qty}</div>
              </div>
              <div className="font-mono font-semibold text-sm">{money(i.price * i.qty)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1.5 text-sm border-t border-black/[0.06] pt-4">
          <div className="flex justify-between text-black/60"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="flex justify-between text-black/60"><span>Shipping</span><span>{shipping === 0 ? "Free" : money(shipping)}</span></div>
          <div className="flex justify-between font-semibold border-t border-black/[0.06] pt-2 text-base">
            <span>Total</span><span>{money(total)}</span>
          </div>
        </div>

        {method === "bakong" && (
          <div className="mt-6 border border-black/10 rounded-2xl p-5 bg-white text-center space-y-2">
            <div className="text-xs font-mono text-black/40 uppercase tracking-widest">Powered by KHQRPay</div>
            <div className="text-sm text-black/60 leading-relaxed">
              After placing your order you'll be taken to the KHQR payment page.
              Scan with <span className="font-medium text-black">ABA · Wing · Acleda · TrueMoney</span> or any KHQR app.
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default function Payment() {
  return <PaymentForm />;
}
