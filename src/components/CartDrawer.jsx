import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { getSafeImage } from "../api";
import { useCartStore } from "../store/cart";
import { money } from "../utils/format";

export default function CartDrawer({ open }) {
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore((s) => s.subtotal)();

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(10,10,10,0.4)", backdropFilter: "blur(4px)" }}
        onClick={() => setOpen(false)}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-[420px] bg-white flex flex-col shadow-glow">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-3">
            <div className="font-display text-2xl tracking-wide">Your Bag</div>
            {items.length > 0 && (
              <span className="nova-tag">{items.length} item{items.length !== 1 ? "s" : ""}</span>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-sm
              hover:border-black/30 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 && (
            <div className="text-center py-16 text-black/35">
              <div className="text-4xl mb-3">🛍</div>
              <div className="font-mono text-xs uppercase tracking-wider">Your bag is empty</div>
              <div className="text-sm mt-1">Add some fire pieces</div>
            </div>
          )}
          {items.map((i) => (
            <div key={i.id + i.size} className="flex gap-3 p-3 rounded-2xl border border-black/[0.06] bg-black/[0.01]">
              <Link to={`/product/${i.id}`} onClick={() => setOpen(false)} className="flex-shrink-0">
                <img
                  src={getSafeImage(i.image, "https://placehold.co/80x96/f5f5f5/999?text=?")}
                  alt={i.title}
                  className="w-20 h-24 object-cover rounded-xl hover:opacity-80 transition-opacity"
                  onError={(e) => { e.target.src = "https://placehold.co/80x96/f5f5f5/999?text=?"; }}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[9px] text-black/35 uppercase tracking-wider">{i.brand}</div>
                <Link to={`/product/${i.id}`} onClick={() => setOpen(false)}
                  className="text-sm font-semibold leading-snug mt-0.5 line-clamp-2 hover:underline block">
                  {i.title}
                </Link>
                <div className="text-xs text-black/40 mt-0.5">Size {i.size}</div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty(i.id, i.size, i.qty - 1)}
                      className="w-6 h-6 rounded-full border border-black/15 text-xs flex items-center justify-center hover:border-gold transition-colors"
                    >
                      −
                    </button>
                    <span className="font-mono text-sm w-4 text-center">{i.qty}</span>
                    <button
                      onClick={() => setQty(i.id, i.size, i.qty + 1)}
                      className="w-6 h-6 rounded-full border border-black/15 text-xs flex items-center justify-center hover:border-gold transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="font-bold text-sm">{money(i.price * i.qty)}</div>
                </div>

                <button
                  onClick={() => remove(i.id, i.size)}
                  className="text-[10px] font-mono uppercase tracking-wider text-black/30
                    hover:text-red-500 transition-colors mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 pb-6 pt-4 border-t border-black/[0.06] space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{money(subtotal)}</span>
              </div>
            </div>

            <Link
              to="/pay"
              onClick={() => setOpen(false)}
              className="block text-center w-full py-3 bg-black text-white rounded-full font-medium
                hover:bg-black/85 transition-colors btn-shimmer"
            >
              Checkout →
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="block text-center w-full py-2.5 border border-black/10 rounded-full text-sm
                text-black/60 hover:border-black/25 transition-colors"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}