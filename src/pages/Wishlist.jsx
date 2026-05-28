import React from "react";
import { Link } from "react-router-dom";
import { getSafeImage, getProducts } from "../api";
import { useCartStore } from "../store/cart";
import { useUserStore } from "../store/user";
import { money } from "../utils/format";

export default function Wishlist() {
  const user = useUserStore((s) => s.user);
  const toggleWishlist = useUserStore((s) => s.toggleWishlist);
  const addToCart = useCartStore((s) => s.add);
  const [addedId, setAddedId] = React.useState(null);
  const [allProducts, setAllProducts] = React.useState([]);

  React.useEffect(() => {
    getProducts().then(setAllProducts).catch(() => {});
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">♡</div>
        <div className="font-display text-4xl mb-2">Saved Items</div>
        <p className="text-black/50 mb-6">Sign in to view your wishlist.</p>
        <Link to="/auth" className="nova-pill solid px-8 py-3">Sign in →</Link>
      </div>
    );
  }

  const wishlist = allProducts.filter((p) => user.wishlist?.includes(p.id));

  const handleAdd = (p) => {
    addToCart(p, p.size?.[0] || "M", 1);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 border-b border-black/[0.06] pb-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-black/35 mb-1">Your Collection</div>
          <h1 className="font-display text-5xl">Saved Items</h1>
          <p className="text-sm text-black/50 mt-1">{wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved</p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={() => wishlist.forEach((p) => addToCart(p, p.size?.[0] || "M", 1))}
            className="nova-pill solid px-6 py-2.5 text-sm hidden sm:flex items-center gap-2"
          >
            Add all to bag →
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-7xl mb-5 opacity-20">♡</div>
          <div className="font-display text-3xl mb-2">Nothing saved yet</div>
          <p className="text-sm text-black/50 mb-8 max-w-xs mx-auto">Heart items while browsing to save them here for later.</p>
          <Link to="/shop" className="nova-pill solid px-8 py-3">Explore the shop →</Link>
        </div>
      ) : (
        <>
          {/* Mobile add all */}
          <button
            onClick={() => wishlist.forEach((p) => addToCart(p, p.size?.[0] || "M", 1))}
            className="nova-pill solid px-6 py-2.5 text-sm sm:hidden flex items-center gap-2 mb-6"
          >
            Add all to bag →
          </button>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {wishlist.map((p) => {
              const discount = p.compareAt
                ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100)
                : null;
              return (
                <div key={p.id} className="nova-card overflow-hidden group flex flex-col">
                  <div className="relative aspect-[3/4] bg-chrome/30 overflow-hidden">
                    <img
                      src={getSafeImage(p.image)}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = "https://placehold.co/300x400/f5f5f5/999?text=NOVA"; }}
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {p.badge && <span className="nova-tag">{p.badge}</span>}
                      {discount && <span className="nova-tag gold">-{discount}%</span>}
                    </div>
                    {/* Remove from wishlist */}
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      title="Remove from wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm hover:bg-red-500 transition-colors"
                    >
                      ♥
                    </button>
                  </div>

                  <div className="p-4 flex flex-col gap-1 flex-1">
                    <div className="font-mono text-[9px] text-black/35 uppercase tracking-wider">{p.brand}</div>
                    <div className="text-sm font-semibold leading-snug line-clamp-2">{p.title}</div>
                    <div className="flex items-baseline gap-2 mt-auto pt-3">
                      <span className="font-bold text-sm">{money(p.price)}</span>
                      {p.compareAt && (
                        <span className="text-xs text-black/35 line-through">{money(p.compareAt)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAdd(p)}
                      className={`mt-2 w-full py-2 text-xs rounded-full font-medium border transition-all duration-200
                        ${addedId === p.id
                          ? "bg-gold text-black border-gold"
                          : "bg-black text-white border-black hover:bg-black/80"
                        }`}
                    >
                      {addedId === p.id ? "✓ Added to bag" : "Add to bag"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue shopping CTA */}
          <div className="mt-12 text-center border-t border-black/[0.06] pt-10">
            <p className="text-sm text-black/50 mb-4">Discover more pieces</p>
            <Link to="/shop" className="nova-pill px-8 py-3 text-sm">Continue shopping →</Link>
          </div>
        </>
      )}
    </div>
  );
}