import React from "react";
import { createPortal } from "react-dom";
import { getSafeImage } from "../api";
import { useCartStore } from "../store/cart";
import { useUserStore } from "../store/user";
import { money, sizes } from "../utils/format";

export default function ProductModal({ product, onClose }) {
  const [size, setSize] = React.useState(product?.size?.[0] || "M");
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const add = useCartStore((s) => s.add);
  const user = useUserStore((s) => s.user);
  const toggleWishlist = useUserStore((s) => s.toggleWishlist);
  const wished = user?.wishlist?.includes(product?.id);

  if (!product) return null;

  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : null;

  const handleAdd = () => {
    add(product, size, qty);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,10,0.6)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-glow animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative bg-chrome/30 aspect-square md:aspect-auto md:min-h-[440px]">
            <img
              src={getSafeImage(product.image)}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://placehold.co/440x440/f5f5f5/999?text=NOVA"; }}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {product.badge && <span className="nova-tag">{product.badge}</span>}
              {discount && <span className="nova-tag gold">-{discount}%</span>}
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 border border-black/10
                flex items-center justify-center text-sm hover:bg-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Info */}
          <div className="p-7 flex flex-col gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-black/35 mb-1">{product.brand}</div>
              <div className="font-display text-3xl leading-tight">{product.title}</div>
            </div>

            <div className="flex items-baseline gap-3">
              <div className="text-2xl font-bold">{money(product.price)}</div>
              {product.compareAt && (
                <div className="text-black/35 line-through text-sm">{money(product.compareAt)}</div>
              )}
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-black/50">Size</span>
                <button className="text-xs text-gold underline">Size guide →</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((s) => {
                  const available = !product.size || product.size.includes(s);
                  return (
                    <button
                      key={s}
                      disabled={!available}
                      onClick={() => setSize(s)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium border transition-all
                        ${!available ? "opacity-25 cursor-not-allowed" : ""}
                        ${size === s
                          ? "bg-black text-white border-black"
                          : "border-black/15 hover:border-gold"
                        }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Qty */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-black/50 mb-2">Quantity</div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 rounded-full border border-black/15 hover:border-gold flex items-center justify-center text-lg transition-colors"
                >
                  −
                </button>
                <span className="font-mono text-base w-6 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 rounded-full border border-black/15 hover:border-gold flex items-center justify-center text-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleAdd}
                className={`flex-1 py-3 rounded-full font-medium text-sm transition-all
                  ${added
                    ? "bg-gold text-black"
                    : "bg-black text-white hover:bg-black/85"
                  }`}
              >
                {added ? "✓ Added to bag!" : `Add to bag — ${money(product.price * qty)}`}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all
                  ${wished ? "bg-black text-white border-black" : "border-black/15 hover:border-gold"}`}
              >
                {wished ? "♥" : "♡"}
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex gap-3 text-xs text-black/40 font-mono pt-2 border-t border-black/[0.06]">
              <span>🛡 Authentic</span>
              <span>↩ 7-day returns</span>
              <span>🚚 Fast ship</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}