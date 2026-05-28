import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { getAdminStats, getOrders } from "../../api";

// ── Status Badge ───────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    pending:    "bg-gray-100 text-gray-500 border-gray-200",
    processing: "bg-amber-50 text-amber-700 border-amber-200",
    shipped:    "bg-blue-50 text-blue-700 border-blue-200",
    delivered:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled:  "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${map[status] || "bg-gray-100 text-gray-500 border-gray-200"}`}>
      {status}
    </span>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, change, changeSub = "vs last 30 days", up }) {
  return (
    <div className="bg-white rounded-2xl border border-black/[0.07] p-6 flex flex-col gap-3 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)] transition-shadow">
      <div className="text-xs text-black/40 font-medium">{label}</div>
      <div className="font-display text-5xl text-black tracking-tight leading-none">{value}</div>
      {change != null && (
        <div>
          <span className={`text-sm font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
            {up ? "↑" : "↓"} {change}
          </span>
          <span className="text-xs text-black/30 ml-2">{changeSub}</span>
        </div>
      )}
    </div>
  );
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-black/10 rounded-xl shadow-lg px-4 py-3 text-sm">
      <div className="font-mono text-xs text-black/40 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="font-semibold text-black">{prefix}{typeof p.value === "number" ? p.value.toFixed(p.value % 1 === 0 ? 0 : 2) : p.value}</span>
          <span className="text-black/35 text-xs">{p.name}</span>
        </div>
      ))}
    </div>
  );
}

// ── Build chart data from real orders ─────────────────────────────────────
function buildChartData(orders) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();

  // Last 6 months
  const buckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { month: months[d.getMonth()], year: d.getFullYear(), revenue: 0, orders: 0, delivered: 0 };
  });

  orders.forEach(o => {
    const ts = o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000) : new Date(o.createdAt ?? null);
    if (!ts || isNaN(ts)) return;
    const bucket = buckets.find(b => b.month === months[ts.getMonth()] && b.year === ts.getFullYear());
    if (!bucket) return;
    bucket.orders += 1;
    if (o.status !== "cancelled") bucket.revenue += o.total ?? 0;
    if (o.status === "delivered")  bucket.delivered += 1;
  });

  return buckets;
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats,   setStats]   = React.useState(null);
  const [orders,  setOrders]  = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([getAdminStats(), getOrders()])
      .then(([s, o]) => { setStats(s); setOrders(o); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const revenue     = stats?.revenue_total ?? 0;
  const totalOrders = stats?.total_orders  ?? 0;
  const delivered   = stats?.delivered     ?? 0;
  const cancelled   = stats?.cancelled     ?? 0;
  const processing  = stats?.processing    ?? 0;

  const chartData = React.useMemo(() => buildChartData(orders), [orders]);

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-52 bg-black/5 rounded-xl" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-black/5 rounded-2xl" />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="h-72 bg-black/5 rounded-2xl" />
        <div className="h-72 bg-black/5 rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-tight text-black">Store Dashboard</h1>
          <p className="text-sm text-black/40 mt-0.5">NOVA Admin · real-time overview</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-black/40 font-medium bg-white border border-black/[0.07] px-4 py-2 rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          This month
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`$${revenue.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={revenue > 0 ? `$${revenue.toFixed(0)}` : null}
          changeSub="all time"
          up
        />
        <StatCard
          label="Total Orders"
          value={totalOrders}
          change={processing > 0 ? `${processing} processing` : "No pending"}
          changeSub="right now"
          up={processing === 0}
        />
        <StatCard
          label="Delivered"
          value={delivered}
          change={totalOrders > 0 ? `${Math.round((delivered / totalOrders) * 100)}%` : "0%"}
          changeSub="fulfilment rate"
          up
        />
        <StatCard
          label="Cancelled"
          value={cancelled}
          change={totalOrders > 0 ? `${Math.round((cancelled / totalOrders) * 100)}%` : "0%"}
          changeSub="cancellation rate"
          up={cancelled === 0}
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Revenue bar chart */}
        <div className="bg-white rounded-2xl border border-black/[0.07] p-6">
          <div className="mb-5">
            <div className="font-semibold text-black text-sm">Revenue</div>
            <div className="text-xs text-black/35 mt-0.5">Last 6 months · USD</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={28} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(0,0,0,0.35)", fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(0,0,0,0.35)", fontFamily: "monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip prefix="$" />} cursor={{ fill: "rgba(0,0,0,0.03)", radius: 6 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#0a0a0a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders line chart */}
        <div className="bg-white rounded-2xl border border-black/[0.07] p-6">
          <div className="mb-5">
            <div className="font-semibold text-black text-sm">Orders</div>
            <div className="text-xs text-black/35 mt-0.5">Last 6 months · total vs delivered</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(0,0,0,0.35)", fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(0,0,0,0.35)", fontFamily: "monospace" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "11px", paddingTop: "12px", fontFamily: "monospace", color: "rgba(0,0,0,0.4)" }}
              />
              <Line type="monotone" dataKey="orders"    name="Orders"    stroke="#0a0a0a" strokeWidth={2.5} dot={{ r: 4, fill: "#0a0a0a", strokeWidth: 0 }}    activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="delivered" name="Delivered" stroke="#d4af37" strokeWidth={2.5} dot={{ r: 4, fill: "#d4af37", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ── Recent orders ── */}
      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.05]">
          <div className="font-semibold text-sm text-black">Recent orders</div>
          <Link to="/admin/orders" className="text-xs text-black/35 hover:text-black font-mono uppercase tracking-widest transition-colors">
            View all →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-black/[0.02] border-b border-black/[0.05]">
              {["Order", "Customer", "Total", "Method", "Status"].map(h => (
                <th key={h} className="text-left px-6 py-3 text-[10px] font-mono uppercase tracking-[0.15em] text-black/30 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 6).map(o => (
              <tr key={o.id} className="border-b border-black/[0.04] hover:bg-black/[0.01] transition-colors">
                <td className="px-6 py-3.5 font-mono text-xs text-black/50 font-semibold">{o.order_number}</td>
                <td className="px-6 py-3.5 text-black/65">{o.user_email}</td>
                <td className="px-6 py-3.5 font-mono font-bold text-black">${(o.total || 0).toFixed(2)}</td>
                <td className="px-6 py-3.5 font-mono text-xs text-black/40 uppercase">{o.payment_method}</td>
                <td className="px-6 py-3.5"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center font-mono text-xs text-black/25 uppercase tracking-widest">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Quick links ── */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { to: "/admin/products", label: "Products",  sub: "Add · Edit · Badge",  icon: "👕" },
          { to: "/admin/orders",   label: "Orders",    sub: "Status · Fulfilment",  icon: "📦", badge: processing > 0 ? processing : null },
          { to: "/admin/users",    label: "Users",     sub: "Roles · Ban · Review", icon: "👥" },
        ].map(({ to, label, sub, icon, badge }) => (
          <Link key={to} to={to}
            className="group bg-white border border-black/[0.07] hover:border-black/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-2xl p-5 flex items-center gap-4 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-black/[0.04] group-hover:bg-black flex items-center justify-center text-xl transition-all duration-200">
              {icon}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-black flex items-center gap-2">
                {label}
                {badge && <span className="text-[9px] font-mono font-bold bg-amber-400 text-black px-1.5 py-0.5 rounded-full">{badge}</span>}
              </div>
              <div className="text-[10px] font-mono text-black/30 mt-0.5">{sub}</div>
            </div>
            <span className="text-black/20 group-hover:text-black group-hover:translate-x-0.5 transition-all">→</span>
          </Link>
        ))}
      </div>

    </div>
  );
}
