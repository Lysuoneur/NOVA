import React from "react";
import { NavLink, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../../store/user";
import { useAdminStore } from "../../store/admin";

export default function AdminLayout() {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const products = useAdminStore((s) => s.products);
  const orders = useAdminStore((s) => s.orders);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const isAdmin = user?.email === "admin@nova.com" || user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center text-3xl mx-auto mb-5">🔐</div>
          <div className="font-display text-3xl mb-2">Admin Access</div>
          <p className="text-sm text-black/50 mb-6">
            Login as <span className="font-mono text-black/70">admin@nova.com</span> to access the dashboard.
          </p>
          <Link to="/auth" className="nova-pill solid px-8 py-3 text-sm">Sign in →</Link>
        </div>
      </div>
    );
  }

  const processing = orders.filter((o) => o.status === "Processing").length;
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  const navItems = [
    {
      to: "/admin", label: "Dashboard", end: true,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      ),
    },
    {
      to: "/admin/products", label: "Products", badge: products.length,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      ),
    },
    {
      to: "/admin/orders", label: "Orders", badge: processing > 0 ? processing : null, badgeColor: "bg-red-500",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
    },
    {
      to: "/admin/users", label: "Users",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      to: "/db", label: "Database",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"/>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-130px)] bg-[#f6f6f4]">

      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed bottom-20 left-4 z-50 w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-[62px] left-0 h-full lg:h-[calc(100vh-62px)]
        w-[240px] flex-shrink-0 bg-[#0a0a0a] text-white flex flex-col z-50
        transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div className="font-display text-xl tracking-wider text-white leading-none">NOVA</div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Admin Console</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col p-3 gap-0.5 flex-1 overflow-y-auto">
          <div className="font-mono text-[9px] text-white/20 uppercase tracking-widest px-3 py-2">Navigation</div>
          {navItems.map(({ to, label, icon, end, badge, badgeColor }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative
                ${isActive
                  ? "bg-white text-black font-semibold"
                  : "text-white/50 hover:text-white hover:bg-white/[0.07]"
                }`
              }
            >
              <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">{icon}</span>
              <span className="flex-1">{label}</span>
              {badge != null && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono ${badgeColor || "bg-white/20 text-white"}`}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.07]">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-display text-sm">
              {user ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/70 font-medium truncate">{user?.name || "Nova Admin"}</div>
              <div className="text-[10px] text-white/30 font-mono truncate">{user?.email || "admin@nova.com"}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="flex-1 text-center text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-lg py-1.5 transition-colors"
            >
              ← Store
            </Link>
            {user ? (
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="flex-1 text-center text-xs text-red-400/70 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-lg py-1.5 transition-colors"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex-1 text-center text-xs text-gold/70 hover:text-gold border border-white/10 hover:border-gold/30 rounded-lg py-1.5 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar breadcrumb */}
        <div className="sticky top-[62px] z-30 bg-[#f6f6f4] border-b border-black/[0.06] px-6 lg:px-8 py-3 flex items-center gap-2 text-sm">
          <Link to="/" className="text-black/30 hover:text-black transition-colors text-xs font-mono">NOVA</Link>
          <span className="text-black/20 text-xs">/</span>
          <span className="text-black/50 text-xs font-mono uppercase tracking-wide">Admin</span>
          {location.pathname !== "/admin" && (
            <>
              <span className="text-black/20 text-xs">/</span>
              <span className="text-black text-xs font-mono uppercase tracking-wide font-semibold">
                {location.pathname.split("/admin/")[1]}
              </span>
            </>
          )}
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="p-6 lg:p-8 max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}