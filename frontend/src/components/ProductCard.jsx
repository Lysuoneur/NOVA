import React from "react";
import { getSafeImage } from "../api";
import { useCartStore } from "../store/cart";
import { useUserStore } from "../store/user";
import { money } from "../utils/format";

export default function ProductCard({ p, onQuick }) {
  const add = useCartStore((s) => s.add);
  const user = useUserStore((s) => s.user);
  const toggleWishlist = useUserStore((s) => s.toggleWishlist);
  const wished = user?.wishlist?.includes(p.id);
  const [adding, setAdding] = React.useState(false);

  const handleAdd = () => {
    add(p, p.size?.[0] || "M", 1);
    setAdding(true);
    setTimeout(() => setAdding(false), 900);
  };

  const discount = p.compareAt
    ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100)
    : null;

  return (
    <div className="group nova-card overflow-hidden flex flex-col">
      {/* Image block */}
      <div className="relative overflow-hidden bg-chrome/30 aspect-[3/4]">
        <img
          src={getSafeImage(p.image)}
          alt={p.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500
            group-hover:scale-108"
          style={{ transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)" }}
          onError={(e) => { e.target.src = "https://placehold.co/400x530/f5f5f5/999?text=NOVA"; }}
        />

        {/* Badges row */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {p.badge && <span className="nova-tag">{p.badge}</span>}
          {discount && <span className="nova-tag gold">-{discount}%</span>}
        </div>

        {/* Wishlist */}
        <button
          aria-label="Wishlist"
          onClick={() => toggleWishlist(p.id)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
            border transition-all duration-150 text-sm
            ${wished
              ? "bg-black text-white border-black"
              : "bg-white/90 border-black/10 hover:border-gold backdrop-blur-sm"
            }`}
        >
          {wished ? "♥" : "♡"}
        </button>

        {/* Quick view overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100
          transition-opacity duration-200 bg-gradient-to-t from-black/30 to-transparent">
          <button
            onClick={() => onQuick?.(p)}
            className="flex-1 text-xs bg-white/95 backdrop-blur rounded-lg py-2 font-medium
              hover:bg-white transition-colors"
          >
            Quick view
          </button>
        </div>
      </div>

      {/* Info block */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="font-mono text-[10px] text-black/35 uppercase tracking-wider">{p.brand}</div>
        <div className="text-sm font-semibold leading-snug text-black line-clamp-2">{p.title}</div>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold">{money(p.price)}</span>
            {p.compareAt && (
              <span className="text-xs text-black/35 line-through">{money(p.compareAt)}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5
              border transition-all duration-200
              ${adding
                ? "bg-gold text-black border-gold"
                : "bg-black text-white border-black hover:bg-black/80"
              }`}
          >
            {adding ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}