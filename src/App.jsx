import { clsx } from "clsx";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import RoutesIndex from "./routes.jsx";
import { useCartStore } from "./store/cart";
import { useUserStore } from "./store/user";

/* ── TOP RUNNING LINE ── */
function TopBar() {
  const items = [
    { text: "NOVA STREETWEAR", dot: "green" },
    { text: "AUTHENTIC VN BRANDS", dot: "gold" },
    { text: "FREE SHIP OVER $50", dot: "pink" },
    { text: "48H PHNOM PENH", dot: "green" },
    { text: "NEW DROPS WEEKLY", dot: "gold" },
    { text: "COD + VISA ACCEPTED", dot: "pink" },
    { text: "100% AUTHENTIC GUARANTEE", dot: "green" },
    { text: "GEN Z LUXE · SLAY DAILY", dot: "gold" },
    { text: "CAMBODIA × VIETNAM", dot: "pink" },
    { text: "NO FAKES. EVER.", dot: "green" },
    { text: "SS25 COLLECTION LIVE", dot: "gold" },
    { text: "7-DAY EASY RETURNS", dot: "pink" },
  ];
  const repeated = [...items, ...items, ...items];
  return (
    <div className="nova-top-bar" id="nova-top-bar">
      <div className="nova-top-bar-track">
        {repeated.map((item, i) => (
          <span key={i} className="nova-top-bar-item">
            <span className={`dot ${item.dot}`} />
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Custom Cursor ── */
function NovaCursor() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => { el.style.left = e.clientX + "px"; el.style.top = e.clientY + "px"; };
    const over = (e) => { if (e.target.closest("a,button,[role=button]")) el.classList.add("hovering"); else el.classList.remove("hovering"); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    return () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); };
  }, []);
  return <div ref={ref} id="nova-cursor" />;
}

/* ── Status Bar ── */
function StatusBar() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((a, b) => a + b.qty, 0);
  const user = useUserStore((s) => s.user);
  const wishlistCount = user?.wishlist?.length || 0;
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const statusItems = [
    "NOVA STREETWEAR — CAMBODIA × VIETNAM",
    "FREE SHIPPING OVER $50",
    "AUTHENTIC BRANDS ONLY",
    "48H DELIVERY — PHNOM PENH",
    "GEN Z LUXE — SLAY DAILY",
    "NEW DROPS EVERY WEEK",
    "NO FAKES. EVER.",
    "VISA + COD ACCEPTED",
    "100% AUTHENTIC GUARANTEE",
    "SS25 COLLECTION LIVE NOW",
  ];

  return (
    <div className="nova-status-bar">
      <div className="status-segment">
        <span className="status-dot" />
        <span style={{ color: "#b4ff00", fontWeight: 700 }}>LIVE</span>
      </div>
      <div className="status-segment">
        <span className="status-dot gold" />
        <span>{user ? user.name.toUpperCase() : "GUEST"}</span>
      </div>
      <div className="status-segment">
        <span className="status-dot pink" />
        <span>BAG: {count}</span>
      </div>
      {wishlistCount > 0 && (
        <div className="status-segment">
          <span className="status-dot gold" />
          <span>SAVED: {wishlistCount}</span>
        </div>
      )}
      <div className="status-marquee">
        <div className="status-marquee-inner">
          {[...statusItems, ...statusItems, ...statusItems].map((item, i) => (
            <span key={i} className="status-marquee-item">✦ {item}</span>
          ))}
        </div>
      </div>
      <div className="status-segment" style={{ borderRight: "none" }}>
        <span style={{ color: "#d4af37" }}>
          {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

/* ── Navbar ── */
function Nav() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((a, b) => a + b.qty, 0);
  const loc = useLocation();
  const [scrolled,  setScrolled]  = React.useState(false);
  const [hidden,    setHidden]    = React.useState(false);
  const [menuOpen,  setMenuOpen]  = React.useState(false);
  const user = useUserStore((s) => s.user);
  const wishlistCount = user?.wishlist?.length || 0;
  const isAdmin = user?.email === "admin@nova.com" || user?.role === "admin";

  React.useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > 80 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { to: "/shop",                    label: "Shop" },
    { to: isAdmin ? "/admin" : "/profile", label: isAdmin ? "Dashboard" : "Profile" },
  ];

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 transition-all duration-300",
        hidden && "-translate-y-full",
        scrolled
          ? "bg-white/96 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.05),0_4px_20px_rgba(0,0,0,0.06)]"
          : "bg-white border-b border-black/[0.06]"
      )}
    >
      {/* Top accent line */}
      <div className="black-gold-line" />

      <div className="max-w-7xl mx-auto px-5 h-[62px] flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5 flex-shrink-0">
          <span className="font-display text-[34px] leading-none tracking-wider text-black group-hover:text-gold transition-colors duration-200">
            NOVA
          </span>
          <div className="hidden sm:flex flex-col gap-0">
            <span className="font-mono text-[8px] text-black/30 leading-tight border border-black/10 rounded px-1 py-0.5 tracking-widest">
              KH×VN
            </span>
          </div>
        </Link>

        {/* Nav links desktop */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-150",
                loc.pathname === to || loc.pathname.startsWith(to + "/")
                  ? "bg-black text-white"
                  : "text-black/55 hover:text-black hover:bg-black/[0.05]"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search shortcut */}
          <Link
            to="/shop"
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-black/40
              border border-black/08 hover:border-black/20 transition-colors bg-black/[0.02]"
            aria-label="Search"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span className="font-mono tracking-wider">Search</span>
          </Link>

          {/* Wishlist icon */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className={clsx(
              "relative hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm border transition-all duration-150",
              loc.pathname === "/wishlist"
                ? "bg-black text-white border-black"
                : "border-black/10 hover:border-black/25 text-black/65 hover:text-black"
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={loc.pathname === "/wishlist" ? "white" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistCount > 0 && (
              <span className="text-[10px] font-mono font-bold">{wishlistCount}</span>
            )}
          </Link>

          {/* Profile/Login */}
          <Link
            to={user ? (isAdmin ? "/admin" : "/profile") : "/auth"}
            className={clsx(
              "hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-colors",
              loc.pathname === "/profile" || loc.pathname === "/auth" || loc.pathname.startsWith("/admin")
                ? "bg-black text-white border-black"
                : "border-black/10 hover:border-black/25 text-black/65 hover:text-black"
            )}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            {user ? user.name.split(" ")[0] : "Login"}
          </Link>

          <CartButton count={count} />

          <button
            className="md:hidden p-2.5 rounded-xl border border-black/10 hover:bg-black/[0.04] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-black/[0.06] px-5 py-4 flex flex-col gap-1.5 animate-slideUp">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                loc.pathname.startsWith(to)
                  ? "bg-black text-white"
                  : "text-black/70 hover:bg-black/[0.05]"
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 rounded-2xl text-sm font-medium border border-black/10 text-black/70 flex items-center gap-2"
          >
            ♡ Wishlist {wishlistCount > 0 && <span className="text-xs bg-gold/20 text-black px-2 py-0.5 rounded-full font-mono">{wishlistCount}</span>}
          </Link>
          {!user && (
            <Link
              to="/auth"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-2xl text-sm font-medium border border-black/10 text-black/70 mt-1"
            >
              Login / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

function CartButton({ count }) {
  const setOpen = useCartStore((s) => s.setOpen);
  return (
    <button
      aria-label="Open cart"
      onClick={() => setOpen(true)}
      className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-black text-white text-sm
        font-medium hover:bg-black/85 transition-all duration-150 hover:shadow-lg"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <span>Bag</span>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-gold text-black font-bold rounded-full
          w-[18px] h-[18px] flex items-center justify-center font-mono animate-scaleIn">
          {count}
        </span>
      )}
    </button>
  );
}

/* ── Footer ── */
function AppFooter() {
  return (
    <footer className="border-t border-black/[0.06] mt-20 bg-white">
      <div className="black-gold-line" />

      {/* Newsletter strip */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <div className="font-display text-2xl tracking-wider">JOIN THE CULTURE</div>
            <div className="text-xs text-white/45 font-mono mt-1">Get early access to drops + exclusive deals</div>
          </div>
          <div className="flex w-full md:w-auto gap-2 max-w-sm">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2.5 text-sm
                text-white placeholder-white/30 outline-none focus:border-gold transition-colors"
            />
            <button className="nova-pill gold text-xs px-5 py-2.5 whitespace-nowrap font-semibold flex-shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-display text-3xl tracking-wider mb-0.5">NOVA</div>
          <div className="font-mono text-[10px] text-black/35 uppercase tracking-widest mb-3">Cambodia × Vietnam</div>
          <p className="text-sm text-black/55 leading-relaxed">
            Gen Z luxury streetwear. Curated Vietnamese brands. Authentic, fast, local.
          </p>
          <div className="mt-5 flex gap-2">
            <a href="https://t.me/nova.kh" className="nova-pill text-xs py-1.5 px-3">Telegram</a>
            <a href="#" className="nova-pill text-xs py-1.5 px-3">TikTok</a>
            <a href="#" className="nova-pill text-xs py-1.5 px-3">IG</a>
          </div>
        </div>

        <div>
          <div className="font-semibold text-xs uppercase tracking-widest mb-4 text-black/35">Brands</div>
          <ul className="space-y-2 text-sm text-black/60">
            {["Hades Studio", "Whose Studio", "Cozy Worldwide", "SWE", "Now Saigon", "Unkrush", "Gamble Worldwide"].map(b => (
              <li key={b} className="hover:text-black cursor-pointer transition-colors hover:translate-x-1 inline-flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-gold inline-block" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-semibold text-xs uppercase tracking-widest mb-4 text-black/35">Info</div>
          <ul className="space-y-2 text-sm text-black/60">
            {["Shipping & Returns", "Authenticity Promise", "Size Guide", "Privacy Policy", "Terms of Service", "FAQ"].map(item => (
              <li key={item} className="hover:text-black cursor-pointer transition-colors hover:translate-x-1 inline-flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-black/20 inline-block" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-semibold text-xs uppercase tracking-widest mb-4 text-black/35">Contact</div>
          <div className="space-y-3 text-sm text-black/60">
            <div className="flex items-center gap-2">📍 <span>Phnom Penh, Cambodia</span></div>
            <div className="flex items-center gap-2">✉️ <span>hi@nova.com</span></div>
            <div className="flex items-center gap-2">📱 <span>@nova.kh (Telegram)</span></div>
            <div className="flex items-center gap-2">🎵 <span>@nova.streetwear.kh (TikTok)</span></div>
          </div>
          <div className="mt-5 p-4 rounded-2xl bg-black/[0.03] border border-black/[0.06]">
            <div className="text-xs font-mono text-black/35 uppercase tracking-widest mb-1">Delivery Zone</div>
            <div className="text-sm font-semibold">48h · Phnom Penh</div>
            <div className="text-xs text-black/45 mt-0.5">3–5 days nationwide</div>
          </div>
        </div>
      </div>

      <div className="gold-line" />
      <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-2
        text-xs text-black/30 font-mono">
        <span>© {new Date().getFullYear()} NOVA. ALL RIGHTS RESERVED.</span>
        <span>MADE FOR THE CULTURE 🔥</span>
      </div>
    </footer>
  );
}

/* ── App ── */
export default function App() {
  const initAuth = useUserStore((s) => s.initAuth);

  // Initialise Firebase Auth listener once on mount.
  // onAuthStateChanged fires immediately with the persisted session (if any),
  // so there is no flash of logged-out state on page refresh.
  React.useEffect(() => {
    const unsubscribe = initAuth();
    return () => typeof unsubscribe === 'function' && unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="app-root" className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <NovaCursor />
      <Nav />
      <RoutesIndex />
      <AppFooter />
      <StatusBar />
    </div>
  );
}