import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import FeatureStrip from "../components/FeatureStrip";
import Ticker from "../components/Ticker";
import { BRANDS, STORE_CONFIG } from "../data/novaData";
import { getProducts } from '../api';

const ProductModal = lazy(() => import("../components/ProductModal"));

/* ── Hero ── */
function Hero() {
  const { hero } = STORE_CONFIG;
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-4">
      <div className="absolute inset-0 grid-lines-bg opacity-60 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="grid lg:grid-cols-[1fr,520px] gap-8 items-center min-h-[520px]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="nova-tag gold">SS25 Collection</span>
              <span className="font-mono text-[10px] text-black/35 uppercase tracking-widest">
                Cambodia × Vietnam
              </span>
            </div>
            <div className="relative">
              <div className="font-display text-[clamp(72px,14vw,160px)] leading-[0.85] tracking-tight text-black select-none">
                {hero.line1}
                <br />
                <span className="text-gold/20 [-webkit-text-stroke:2px_#d4af37]">{hero.line2}</span>
                <br />
                {hero.line3}
              </div>
            </div>
            <p className="text-base text-black/55 max-w-sm leading-relaxed">{hero.sub}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop" className="nova-pill solid text-sm px-6 py-3 font-semibold">Shop Now →</Link>
              <a href="#brands" className="nova-pill text-sm px-6 py-3">View Brands</a>
            </div>
            <div className="flex gap-8 pt-2">
              {[["10K+", "Shoppers"], ["48h", "Phnom Penh"], ["100%", "Authentic"]].map(([num, label]) => (
                <div key={label}>
                  <div className="font-display text-2xl text-black">{num}</div>
                  <div className="text-xs text-black/40 font-mono uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-3xl overflow-hidden border border-black/[0.06] shadow-glow aspect-[4/5]">
              <img
                src="https://storage.googleapis.com/forty-percent_uploads/33cafbab-3101-4480-b691-a21152adad25"
                alt="Nova streetwear hero"
                className="w-full h-full object-cover"
                style={{ animation: "float 8s ease-in-out infinite" }}
              />
            </div>
            <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl p-4 border border-black/[0.08] shadow-glow flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-lg">🔥</div>
              <div>
                <div className="text-xs font-mono text-black/40 uppercase tracking-wider">Trending now</div>
                <div className="text-sm font-bold">HOT SALE</div>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 nova-tag gold text-xs px-3 py-1.5">NEW DROP</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  const cats = [
    { name: "Tops", image: "https://theme.hstatic.net/1000306633/1001194548/14/block_home_category1_new.png?v=512" },
    { name: "Bottoms",  image: "https://theme.hstatic.net/1000306633/1001194548/14/block_home_category2_new.png?v=512" },
    { name: "Outerwear", image: "https://theme.hstatic.net/1000306633/1001194548/14/block_home_category3_new.png?v=512" },
    { name: "Accessories", image: "https://cozyworldwide.co/cdn/shop/files/4800CE36-64AB-4944-AD54-2D77FA034C92.jpg?v=1734089974&width=990" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-5 py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-black/35 mb-1">Browse</div>
          <h2 className="font-display text-4xl">Categories</h2>
        </div>
        <Link to="/shop" className="text-sm text-black/50 hover:text-black underline underline-offset-4">All products →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cats.map((cat) => (
          <Link
            key={cat.name}
            to={`/shop?cat=${cat.name}`}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] border border-black/[0.06] hover:shadow-glow transition-all duration-300"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)" }}
              onError={(e) => { e.target.src = `https://placehold.co/300x400/f5f5f5/999?text=${cat.name}`; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="text-lg">{cat.icon}</div>
              <div className="font-display text-xl tracking-wide">{cat.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function EditorialBanner() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-8">
      <div className="relative rounded-3xl overflow-hidden bg-black text-white">
        <img
          src="https://hades.studio/cdn/shop/files/z5959220236835_5cf46fb4f526bd5810b7786063b5f10d_2e9e8627-973b-4d99-8e8f-1d6329ab3c7b.jpg?v=1729751960"
          alt="Editorial"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative p-10 md:p-16">
          <div className="max-w-xl">
            <span className="nova-tag outline border-white/30 text-white/70 text-[10px] mb-4 inline-block">Editorial</span>
            <div className="font-display text-5xl md:text-7xl leading-none mb-4">
              FROM SAIGON<br/>TO PHNOM PENH
            </div>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              A pipeline of heat. Drop-ready looks, no fakes, no compromise. Pure culture in every stitch.
            </p>
            <Link to="/shop" className="inline-block mt-6 nova-pill solid text-sm px-6 py-2.5">Explore drops →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [quick, setQuick] = React.useState(null);
  const [allProducts, setAllProducts] = React.useState([]);

  React.useEffect(() => {
    getProducts().then(setAllProducts).catch(console.error);
  }, []);

  const featured = allProducts.slice(0, 8);
  const newArrivals = allProducts.filter(p => p.badge === "NEW").slice(0, 4);

  return (
    <>
      <Hero />
      <Ticker />
      <CategoryGrid />
      <section className="max-w-7xl mx-auto px-5 py-10"><FeatureStrip /></section>
      <Ticker variant="gold" />

      {/* ───────────────── BRAND WALL v2 ───────────────── */}
<section
  id="brands"
  className="relative overflow-hidden border-y border-black bg-white"
>
  {/* subtle structure */}
  <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,black_1px,transparent_1px)] bg-[size:42px_42px]" />
  </div>

  <div className="relative mx-auto max-w-[1900px] px-4 py-24">

    {/* header */}
    <div className="mb-12 flex items-end justify-between gap-6">
      <div>
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-black/35">
          curated streetwear network
        </div>

        <h2 className="font-display text-[clamp(56px,7vw,120px)] uppercase leading-[0.9] tracking-[-0.08em]">
          Brand Explore
        </h2>
      </div>

      <Link
        to="/shop"
        className="group hidden md:flex items-center gap-3 border border-black bg-black px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white hover:text-black"
      >
        Explore All

        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>

    {/* strip */}
    <div className="grid grid-cols-2 border border-black md:grid-cols-4 xl:grid-cols-7">

      {BRANDS.slice(0, 7).map((b, index) => (
        <Link
          key={b.id}
          to={`/shop?brand=${b.shortName}`}
          className="
            group relative isolate overflow-hidden
            border-r border-b border-black
            bg-[#f8f8f8]
            aspect-[0.78]
          "
        >

          {/* FULL IMAGE BG — NO ALPHA */}
          <div className="absolute inset-0">
            <img
              src={b.cover}
              alt={b.name}
              className="
                h-full w-full object-cover
                transition-transform duration-700
                group-hover:scale-[1.04]
              "
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            {/* hard white fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white/95" />

            {/* dark bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-white via-white/85 to-transparent" />
          </div>

          {/* content */}
          <div className="relative z-10 flex h-full flex-col p-5">

            {/* top */}
            <div className="flex items-start justify-between">

              <div className="font-display text-5xl leading-none tracking-tight text-white mix-blend-difference">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* LOGO FILTER MODULE */}
              <div className="relative">

                {/* glow */}
                <div className="absolute inset-0 rounded-[22px] bg-black/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div
                  className="
                    relative flex h-[72px] w-[72px]
                    items-center justify-center
                    overflow-hidden rounded-[22px]
                    border border-white/40
                    backdrop-blur-2xl
                    bg-white/30
                    shadow-[0_4px_30px_rgba(0,0,0,0.08)]
                    transition-all duration-500
                    group-hover:-translate-y-1
                    group-hover:bg-white/45
                  "
                >

                  {/* brand bg reflection */}
                  <img
                    src={b.cover}
                    alt=""
                    className="
                      absolute inset-0
                      h-full w-full object-cover
                      scale-125 blur-md
                    "
                  />

                  {/* filter layer */}
                  <div className="absolute inset-0 bg-white/55 backdrop-saturate-150" />

                  {/* logo */}
                  <img
                    src={b.logo}
                    alt={`${b.name} logo`}
                    className="
                      relative z-10
                      max-h-[58%] max-w-[58%]
                      object-contain
                      grayscale contrast-125 brightness-90
                      transition-all duration-500
                      group-hover:grayscale-0
                      group-hover:scale-105
                    "
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/200x200/ffffff/111?text=${encodeURIComponent(
                        b.shortName || b.name
                      )}`;
                    }}
                  />
                </div>
              </div>
            </div>

            {/* bottom */}
            <div className="mt-auto">

              <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.32em] text-black/45">
                {b.dna}
              </div>

              <h3
                className="
                  font-display
                  text-[clamp(28px,2vw,42px)]
                  uppercase leading-[0.9]
                  tracking-[-0.07em]
                  text-black
                  transition-all duration-500
                  group-hover:translate-x-1
                "
              >
                {b.name}
              </h3>

              <div className="mt-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-black/45">
                <span>{b.origin}</span>
                <span>•</span>
                <span>{b.est}</span>
              </div>

              {/* divider */}
              <div className="my-5 h-px w-full bg-black/10 transition-all duration-500 group-hover:bg-black/25" />

              <p className="line-clamp-3 text-[11px] leading-relaxed text-black/60">
                {b.vibe}
              </p>

              {/* footer */}
              <div className="mt-7 flex items-center justify-between">

                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-black/40">
                  +{b.fitBias} fit bias
                </span>

                <div className="flex items-center gap-2">

                  <span className="bg-black px-2 py-1 font-mono text-[8px] uppercase tracking-[0.22em] text-white">
                    {b.tier}
                  </span>

                  <span className="text-base transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
{/* bottom filter - HORIZONTAL BRAND STRIP */}
<div className="mt-10 border-t border-black pt-7">

  <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-black/35">
    filter by label
  </div>

  {/* horizontal scroll line */}
  <div className="flex items-center gap-6 overflow-x-auto pb-3 scrollbar-hide">

    {BRANDS.map((b) => (
      <Link
        key={b.id}
        to={`/shop?brand=${b.shortName}`}
        className="group flex flex-col items-center gap-2 min-w-[90px]"
      >

        {/* logo circle */}
        <div className="
          relative h-14 w-14 overflow-hidden rounded-full
          border border-black/10 bg-white\
          flex items-center justify-center
          transition-all duration-300
          group-hover:scale-105 group-hover:border-black
        ">

          {/* soft brand background (NO ALPHA LOGO LOOK) */}
          <img
            src={b.cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-10"
          />

          {/* clean white filter layer */}
          <div className="absolute inset-0 bg-black/60" />

          {/* LOGO (filtered style) */}
          <img
            src={b.logo}
            alt={b.name}
            className="
              relative z-10
              max-h-[55%] max-w-[55%]
              object-contain
              grayscale contrast-125 brightness-90
              transition-all duration-300
              group-hover:grayscale-0
              group-hover:brightness-80
              group-hover:scale-110
            "
          />
        </div>

        {/* label */}
        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-black/40 group-hover:text-black transition">
          {b.shortName}
        </div>

      </Link>
    ))}

  </div>
</div>

</div>
</section>

      <EditorialBanner />

      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🛡", title: "100% Authentic", body: "Every product is verified directly from Vietnamese brands. No fakes, ever." },
            { icon: "🚚", title: "Fast Delivery", body: "48-hour delivery in Phnom Penh. 3–5 days across Cambodia." },
            { icon: "↩", title: "Easy Returns", body: "Not feeling it? 7-day hassle-free return policy." },
          ].map(({ icon, title, body }) => (
            <div key={title} className="nova-card p-7 flex flex-col gap-3">
              <div className="text-3xl">{icon}</div>
              <div className="font-display text-2xl">{title}</div>
              <p className="text-sm text-black/55 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {quick && (
        <Suspense fallback={null}>
          <ProductModal product={quick} onClose={() => setQuick(null)} />
        </Suspense>
      )}
    </>
  );
}