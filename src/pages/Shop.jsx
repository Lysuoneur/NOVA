import React from "react";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import Ticker from "../components/Ticker";
import { BRANDS } from "../data/novaData";
import { categories } from "../utils/format";
import { getProducts } from '../api';

const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low", "Most Popular"];

export default function Shop() {
  const [allProducts, setAllProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [q, setQ] = React.useState("");
  const [brand, setBrand] = React.useState("All");
  const [cat, setCat] = React.useState("All");
  const [sort, setSort] = React.useState("Newest");
  const [quick, setQuick] = React.useState(null);
  const [grid, setGrid] = React.useState(4);

  React.useEffect(() => {
    getProducts()
      .then(setAllProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("cat");
    const b = params.get("brand");
    if (c) setCat(c);
    if (b) {
      const found = BRANDS.find(br => br.shortName === b.toUpperCase() || br.id === b.toLowerCase());
      if (found) setBrand(found.name);
    }
  }, []);

  const currentBrandData = React.useMemo(() => {
    return BRANDS.find(b => b.name === brand || b.shortName === brand);
  }, [brand]);

  const products = React.useMemo(() => {
    let ps = [...allProducts];
    if (brand !== "All") {
      ps = ps.filter((p) => (p.brand || "").toLowerCase() === brand.toLowerCase() ||
        (currentBrandData && (p.brand || "").toLowerCase() === currentBrandData.shortName.toLowerCase()));
    }
    if (cat !== "All") ps = ps.filter((p) => p.category === cat);
    if (q) ps = ps.filter((p) => ((p.title || "") + (p.brand || "")).toLowerCase().includes(q.toLowerCase()));
    if (sort === "Price: Low to High") ps.sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") ps.sort((a, b) => b.price - a.price);
    return ps;
  }, [allProducts, q, brand, cat, sort, currentBrandData]);

  const clearFilters = () => { setQ(""); setBrand("All"); setCat("All"); setSort("Newest"); };
  const hasFilters = q || brand !== "All" || cat !== "All";

  return (
    <>
      <div className="border-b border-black/[0.06] bg-white transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 grid-lines-bg opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 py-10 relative z-10">
          <div className="grid md:grid-cols-[1fr,auto] gap-6 items-end">
            <div className="flex flex-col gap-1">
              <div className="font-mono text-[10px] uppercase tracking-widest text-black/35 flex items-center gap-2">
                Discover {currentBrandData && <span className="nova-tag gold text-[8px] px-1.5 py-0.5">{currentBrandData.tier}</span>}
              </div>
              <h1 className="font-display text-5xl md:text-6xl tracking-wide flex items-center gap-3">
                {brand === "All" ? "Shop Archive" : brand}
              </h1>
              <p className="text-sm text-black/50 mt-1 max-w-xl">
                {brand === "All"
                  ? `${products.length} drops logged · Authentic across Vietnamese subcultures.`
                  : `🧬 ${currentBrandData?.dna} // ${currentBrandData?.vibe}`}
              </p>
            </div>
            {currentBrandData && currentBrandData.size_chart && (
              <div className="bg-black text-white p-4 rounded-2xl brutal-glow font-mono text-[10px] border border-white/10 max-w-sm hidden lg:block">
                <div className="text-gold uppercase tracking-widest text-[9px] mb-2 flex justify-between gap-4">
                  <span>📐 {currentBrandData.shortName} ARCHETYPE FIT CHART</span>
                  <span>BIAS: +{currentBrandData.fitBias} Oversized</span>
                </div>
                <div className="grid grid-cols-4 gap-x-4 gap-y-1 text-white/50 border-t border-white/10 pt-2">
                  <span className="text-white">SIZE</span><span>CHEST</span><span>LENGTH</span><span>SHLD</span>
                  {Object.entries(currentBrandData.size_chart).map(([sz, details]) => (
                    <React.Fragment key={sz}>
                      <span className="text-gold font-bold">{sz}</span>
                      <span>{details.chest}</span>
                      <span>{details.length}</span>
                      <span>{details.shoulder}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="mb-8 p-4 bg-black/[0.02] rounded-2xl border border-black/[0.04]">
          <div className="font-mono text-[10px] uppercase tracking-widest text-black/45 mb-3 px-1">Filter by house brand</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setBrand("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                ${brand === "All" ? "bg-black text-white border-black shadow-lg" : "bg-white border-black/10 hover:border-gold text-black/60"}`}
            >
              All Collective
            </button>
            {BRANDS.map(b => (
              <button
                key={b.id}
                onClick={() => setBrand(b.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-2
                  ${brand === b.name ? "bg-black text-white border-black shadow-lg" : "bg-white border-black/10 hover:border-black/30 text-black/60"}`}
              >
                <img src={b.logo} alt="" className={`w-3 h-3 object-contain ${brand === b.name ? 'invert' : 'opacity-60'}`} />
                {b.shortName}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-[260px,1fr] gap-8">
          <aside className="space-y-6">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-black/35 block mb-2">Search</label>
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products..."
                  className="nova-input pr-10"
                />
                {q && (
                  <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black">✕</button>
                )}
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-black/35 block mb-2">Category</label>
              <div className="flex flex-col gap-1.5">
                {["All", ...categories].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`text-left px-3 py-2 rounded-xl text-sm transition-all
                      ${cat === c ? "bg-black text-white font-medium shadow-md" : "text-black/60 hover:bg-black/5 hover:text-black"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button onClick={clearFilters} className="w-full py-2.5 rounded-xl border border-black/10 text-sm text-black/50 hover:border-black/25 hover:text-black transition-colors">
                Clear all filters
              </button>
            )}
          </aside>

          <section>
            <div className="flex items-center justify-between mb-5 gap-4">
              <div className="text-sm text-black/50 font-mono">
                {loading ? "Loading…" : `${products.length} result${products.length !== 1 ? "s" : ""} logged`}
              </div>
              <div className="flex items-center gap-3">
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="nova-input text-sm py-2 w-auto">
                  {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
                <div className="flex border border-black/10 rounded-lg overflow-hidden">
                  {[2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setGrid(n)}
                      className={`px-3 py-2 text-xs font-mono transition-colors ${grid === n ? "bg-black text-white" : "text-black/40 hover:text-black"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {q && <span className="nova-tag outline flex items-center gap-1.5">Search: {q}<button onClick={() => setQ("")}>✕</button></span>}
                {brand !== "All" && <span className="nova-tag outline flex items-center gap-1.5">{brand}<button onClick={() => setBrand("All")}>✕</button></span>}
                {cat !== "All" && <span className="nova-tag outline flex items-center gap-1.5">{cat}<button onClick={() => setCat("All")}>✕</button></span>}
              </div>
            )}

            {loading ? (
              <div className={`grid gap-4 ${grid === 2 ? "grid-cols-2" : grid === 3 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-black/5 animate-pulse aspect-[3/4]" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 text-black/30">
                <div className="text-5xl mb-4">🔍</div>
                <div className="font-display text-2xl mb-2">No products found</div>
                <div className="text-sm">Try adjusting your filters</div>
                <button onClick={clearFilters} className="mt-4 nova-pill solid text-sm">Clear filters</button>
              </div>
            ) : (
              <div className={`grid gap-4 ${grid === 2 ? "grid-cols-2" : grid === 3 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
                {products.map((p) => <ProductCard key={p.id} p={p} onQuick={setQuick} />)}
              </div>
            )}
          </section>
        </div>
      </div>

      <Ticker variant="gold" />
      {quick && <ProductModal product={quick} onClose={() => setQuick(null)} />}
    </>
  );
}
