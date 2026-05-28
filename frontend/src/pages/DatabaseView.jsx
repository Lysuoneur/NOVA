import React from "react";
import { Link } from "react-router-dom";
import { getAdminUsers, getProducts, getOrders, getAdminStats } from "../api";

/* ── Helpers ── */
const statusColors = {
  pending:    "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped:    "bg-purple-100 text-purple-800",
  delivered:  "bg-green-100 text-green-800",
  cancelled:  "bg-red-100 text-red-800",
  paid:       "bg-green-100 text-green-800",
  unpaid:     "bg-red-100 text-red-800",
  refunded:   "bg-gray-100 text-gray-700",
  admin:      "bg-gold/20 text-yellow-800",
  user:       "bg-gray-100 text-gray-600",
};

const Badge = ({ label }) => (
  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${statusColors[label] || "bg-gray-100 text-gray-600"}`}>
    {label}
  </span>
);

const Pill = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all ${
      active ? "bg-black text-white" : "bg-black/5 text-black/50 hover:bg-black/10"
    }`}
  >
    {children}
  </button>
);

/* ── Stat Card ── */
const StatCard = ({ label, value, sub, accent }) => (
  <div className={`rounded-2xl border p-4 ${accent ? "bg-black text-white border-black" : "bg-white border-black/[0.08]"}`}>
    <div className={`font-display text-3xl leading-none mb-0.5 ${accent ? "text-white" : "text-black"}`}>{value ?? "—"}</div>
    <div className={`font-mono text-[10px] uppercase tracking-widest ${accent ? "text-white/50" : "text-black/40"}`}>{label}</div>
    {sub && <div className={`text-xs mt-1 ${accent ? "text-white/60" : "text-black/40"}`}>{sub}</div>}
  </div>
);

/* ── Tables ── */
function UsersTable({ data, loading }) {
  if (loading) return <LoadingRows cols={6} />;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-black/[0.06]">
          {["ID","Name","Email","Role","Banned","City","Joined"].map(h => (
            <th key={h} className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-black/35 font-normal">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((u) => (
          <tr key={u.id} className="border-b border-black/[0.04] hover:bg-black/[0.015] transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-black/40">#{u.id}</td>
            <td className="py-3 px-4 font-medium">{u.name}</td>
            <td className="py-3 px-4 text-black/60 font-mono text-xs">{u.email}</td>
            <td className="py-3 px-4"><Badge label={u.role} /></td>
            <td className="py-3 px-4">
              {u.banned
                ? <span className="text-red-500 font-mono text-xs font-bold">BANNED</span>
                : <span className="text-black/20 text-xs">—</span>}
            </td>
            <td className="py-3 px-4 text-black/50 text-xs">{u.city || "—"}</td>
            <td className="py-3 px-4 text-black/40 font-mono text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ProductsTable({ data, loading }) {
  if (loading) return <LoadingRows cols={7} />;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-black/[0.06]">
          {["ID","Name","Brand","Category","Price","Stock","Badge","Active"].map(h => (
            <th key={h} className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-black/35 font-normal">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((p) => (
          <tr key={p.id} className="border-b border-black/[0.04] hover:bg-black/[0.015] transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-black/40">#{p.id}</td>
            <td className="py-3 px-4">
              <div className="flex items-center gap-2.5">
                {p.image && <img src={p.image} alt="" className="w-8 h-8 object-cover rounded-lg flex-shrink-0" onError={e => e.target.style.display='none'} />}
                <div>
                  <div className="font-medium text-xs leading-tight">{p.name}</div>
                  <div className="font-mono text-[10px] text-black/30">{p.sku}</div>
                </div>
              </div>
            </td>
            <td className="py-3 px-4 text-black/60 text-xs">{p.brand || "—"}</td>
            <td className="py-3 px-4 text-black/60 text-xs">{p.category || "—"}</td>
            <td className="py-3 px-4 font-mono font-bold text-sm">
              ${p.price}
              {p.compare_at && <span className="ml-1 text-black/25 line-through text-xs">${p.compare_at}</span>}
            </td>
            <td className="py-3 px-4">
              <span className={`font-mono font-bold text-xs ${p.stock <= 5 ? "text-red-500" : p.stock <= 15 ? "text-yellow-600" : "text-green-600"}`}>
                {p.stock}
              </span>
            </td>
            <td className="py-3 px-4">{p.badge ? <Badge label={p.badge} /> : <span className="text-black/20">—</span>}</td>
            <td className="py-3 px-4">
              <span className={`w-2 h-2 rounded-full inline-block ${p.active ? "bg-green-400" : "bg-red-400"}`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OrdersTable({ data, loading }) {
  if (loading) return <LoadingRows cols={7} />;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-black/[0.06]">
          {["Order #","Customer","Items","Total","Payment","Status","Date"].map(h => (
            <th key={h} className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-widest text-black/35 font-normal">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((o) => (
          <tr key={o.id} className="border-b border-black/[0.04] hover:bg-black/[0.015] transition-colors">
            <td className="py-3 px-4 font-mono font-bold text-xs">{o.order_number}</td>
            <td className="py-3 px-4">
              <div className="text-xs font-medium">{o.ship_name}</div>
              <div className="font-mono text-[10px] text-black/40">{o.user_email}</div>
            </td>
            <td className="py-3 px-4">
              <div className="flex flex-col gap-0.5">
                {(o.items || []).slice(0, 2).map((item, i) => (
                  <span key={i} className="text-[11px] text-black/60 truncate max-w-[160px]">
                    {item.qty}× {item.product_title}
                    {item.size && <span className="text-black/30"> ({item.size})</span>}
                  </span>
                ))}
                {(o.items || []).length > 2 && (
                  <span className="text-[10px] text-black/30">+{o.items.length - 2} more</span>
                )}
              </div>
            </td>
            <td className="py-3 px-4 font-mono font-bold">${Number(o.total).toFixed(2)}</td>
            <td className="py-3 px-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase text-black/50">{o.payment_method}</span>
                <Badge label={o.payment_status} />
              </div>
            </td>
            <td className="py-3 px-4"><Badge label={o.status} /></td>
            <td className="py-3 px-4 font-mono text-xs text-black/40">{new Date(o.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LoadingRows({ cols }) {
  return (
    <table className="w-full">
      <tbody>
        {[...Array(5)].map((_, i) => (
          <tr key={i} className="border-b border-black/[0.04]">
            {[...Array(cols)].map((_, j) => (
              <td key={j} className="py-4 px-4">
                <div className="h-3 bg-black/5 rounded animate-pulse" style={{ width: `${40 + Math.random() * 50}%` }} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── JSON Viewer ── */
function JsonPane({ data }) {
  const [pretty, setPretty] = React.useState(true);
  const json = JSON.stringify(data, null, pretty ? 2 : 0);
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setPretty(!pretty)} className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${pretty ? "bg-black text-white border-black" : "border-black/15 text-black/50"}`}>
          Pretty
        </button>
        <button onClick={() => navigator.clipboard.writeText(json)} className="px-3 py-1.5 rounded-lg text-xs font-mono border border-black/15 text-black/50 hover:border-black/30 transition-colors">
          Copy JSON
        </button>
        <span className="ml-auto font-mono text-[10px] text-black/30">{data.length} records · {(json.length / 1024).toFixed(1)} KB</span>
      </div>
      <div className="rounded-2xl overflow-hidden border border-black/[0.08]">
        <div className="bg-black/[0.03] border-b border-black/[0.06] px-4 py-2 flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="font-mono text-[10px] text-black/30 ml-2">nova.db.json</span>
        </div>
        <pre className="text-[11px] p-5 overflow-auto max-h-[500px] leading-relaxed font-mono text-black/65 bg-white">{json}</pre>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function DatabaseView() {
  const [tab, setTab] = React.useState("overview");
  const [view, setView] = React.useState("table"); // table | json
  const [users, setUsers]       = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [orders, setOrders]     = React.useState([]);
  const [stats, setStats]       = React.useState(null);
  const [loading, setLoading]   = React.useState({});
  const [error, setError]       = React.useState(null);

  const load = React.useCallback(async (key, fn, setter) => {
    setLoading(l => ({ ...l, [key]: true }));
    try {
      const data = await fn();
      setter(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(`Failed to load ${key}: ${e.message}`);
    } finally {
      setLoading(l => ({ ...l, [key]: false }));
    }
  }, []);

  React.useEffect(() => {
    load("stats",    getAdminStats,  setStats);
    load("users",    getAdminUsers,  setUsers);
    load("products", getProducts,    setProducts);
    load("orders",   getOrders,      setOrders);
  }, [load]);

  const tabs = [
    { key: "overview",  label: "Overview",  icon: "📊" },
    { key: "users",     label: "Users",     icon: "👥", count: users.length },
    { key: "products",  label: "Products",  icon: "👕", count: products.length },
    { key: "orders",    label: "Orders",    icon: "📦", count: orders.length },
  ];

  const tableData = { users, products, orders }[tab] || [];

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 min-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-black/30 mb-1">Admin · System</div>
          <h1 className="font-display text-4xl tracking-tight">Database Explorer</h1>
          <p className="text-sm text-black/40 mt-1">Live data from Laravel + SQLite backend</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin" className="px-4 py-2 rounded-full border border-black/15 text-sm font-medium hover:bg-black/5 transition-colors">
            ← Admin
          </Link>
          <button
            onClick={() => {
              load("stats", getAdminStats, setStats);
              load("users", getAdminUsers, setUsers);
              load("products", getProducts, setProducts);
              load("orders", getOrders, setOrders);
            }}
            className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
          <span className="text-red-500 mt-0.5">⚠</span>
          <div>
            <div className="text-sm font-semibold text-red-700">API Error</div>
            <div className="text-xs text-red-600 mt-0.5 font-mono">{error}</div>
            <div className="text-xs text-red-500 mt-1">Make sure the Laravel server is running: <code className="bg-red-100 px-1 rounded">php artisan serve</code></div>
          </div>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {tabs.map(({ key, label, icon, count }) => (
          <Pill key={key} active={tab === key} onClick={() => setTab(key)}>
            {icon} {label}
            {count !== undefined && <span className="ml-1.5 opacity-60">({count})</span>}
          </Pill>
        ))}
        {tab !== "overview" && (
          <div className="ml-auto flex items-center gap-1 border border-black/10 rounded-full p-1">
            {["table","json"].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${view === v ? "bg-black text-white" : "text-black/40 hover:text-black"}`}>
                {v}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-8">
          {/* Stat grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Users"    value={users.length}    accent />
            <StatCard label="Products"       value={products.length} />
            <StatCard label="Total Orders"   value={orders.length}   />
            <StatCard label="Active Products" value={products.filter(p=>p.active).length} />
          </div>

          {stats && (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-black/30 mb-3">Order Stats</div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { label: "Pending",    value: stats.pending,    color: "text-yellow-600" },
                  { label: "Processing", value: stats.processing, color: "text-blue-600" },
                  { label: "Shipped",    value: stats.shipped,    color: "text-purple-600" },
                  { label: "Delivered",  value: stats.delivered,  color: "text-green-600" },
                  { label: "Cancelled",  value: stats.cancelled,  color: "text-red-500" },
                  { label: "Revenue ($)", value: `$${Number(stats.revenue_total||0).toFixed(0)}`, color: "text-black" },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-black/[0.07] p-4 text-center">
                    <div className={`font-display text-2xl ${s.color}`}>{s.value}</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-black/35 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schema reference */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-black/30 mb-3">Database Schema</div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  table: "users",
                  cols: ["id", "name", "email", "password", "role", "banned", "phone", "city", "avatar", "created_at"],
                },
                {
                  table: "products",
                  cols: ["id", "name", "sku", "brand", "brand_id", "category", "price", "compare_at", "stock", "sizes", "badge", "image", "active"],
                },
                {
                  table: "orders",
                  cols: ["id", "order_number", "user_id", "user_email", "status", "payment_method", "payment_status", "subtotal", "shipping", "total", "ship_*", "created_at"],
                },
                {
                  table: "order_items",
                  cols: ["id", "order_id", "product_id", "product_title", "product_sku", "size", "qty", "price", "total"],
                },
                {
                  table: "wishlists",
                  cols: ["id", "user_id", "product_id", "created_at"],
                },
                {
                  table: "personal_access_tokens",
                  cols: ["id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at"],
                },
              ].map(({ table, cols }) => (
                <div key={table} className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
                  <div className="bg-black/[0.03] px-4 py-2.5 border-b border-black/[0.06] flex items-center gap-2">
                    <span className="text-[10px]">🗄</span>
                    <span className="font-mono text-xs font-bold text-black/70">{table}</span>
                  </div>
                  <div className="p-4">
                    {cols.map(col => (
                      <div key={col} className="font-mono text-[11px] text-black/50 py-0.5">{col}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Data Tables */}
      {tab !== "overview" && (
        <div className="bg-white rounded-2xl border border-black/[0.08] overflow-hidden">
          {view === "table" ? (
            <div className="overflow-x-auto">
              {tab === "users"    && <UsersTable    data={users}    loading={loading.users} />}
              {tab === "products" && <ProductsTable data={products} loading={loading.products} />}
              {tab === "orders"   && <OrdersTable   data={orders}   loading={loading.orders} />}
              {!loading[tab] && tableData.length === 0 && (
                <div className="py-20 text-center text-black/30 font-mono text-sm">
                  No records found. Run <code className="bg-black/5 px-2 py-0.5 rounded">php artisan db:seed</code>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <JsonPane data={tableData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}