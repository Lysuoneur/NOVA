import React from "react";
import { getOrders, updateOrderStatus } from "../../api";
import { money } from "../../utils/format";
import { StatusBadge } from "./Dashboard";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");

  const fetchOrders = () => {
    setLoading(true);
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  React.useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateOrderStatus(id, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updated } : o)));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchSearch = !search || (o.order_number + o.user_email).toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = ["All", ...STATUSES].map((s) => ({
    label: s,
    count: s === "All" ? orders.length : orders.filter((o) => o.status === s).length,
  }));

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-10 w-40 bg-black/5 rounded-xl animate-pulse" />
        <div className="h-64 bg-black/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-5xl tracking-tight text-black">Orders</h1>
          <p className="font-mono text-[11px] text-black/35 uppercase tracking-[0.18em] mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={fetchOrders} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-black/15 rounded-xl text-xs font-mono uppercase tracking-wider hover:border-black transition-colors disabled:opacity-40">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={loading ? "animate-spin" : ""}>
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {counts.map(({ label, count }) => (
          <button key={label} onClick={() => setStatusFilter(label)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all
              ${statusFilter === label ? "bg-black text-white border-black" : "bg-white border-black/10 text-black/50 hover:border-black/25"}`}>
            {label}
            <span className={`ml-1.5 text-[10px] ${statusFilter === label ? "opacity-60" : "opacity-40"}`}>{count}</span>
          </button>
        ))}
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..."
          className="ml-auto nova-input text-xs py-1.5 w-40" />
      </div>

      <div className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/[0.02] border-b border-black/[0.05]">
                {["Order", "Customer", "Items", "Total", "Payment", "Pay. Status", "Status", "Order Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-mono uppercase tracking-[0.15em] text-black/30 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-black/[0.04] hover:bg-black/[0.015] transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-black/50 font-semibold">{o.order_number}</td>
                  <td className="px-5 py-3 text-black/65 text-xs">{o.user_email}</td>
                  <td className="px-5 py-3 text-xs text-black/40 max-w-[160px] truncate">
                    {o.items?.map((i) => `${i.product_title} ×${i.qty}`).join(", ")}
                  </td>
                  <td className="px-5 py-3 font-mono font-bold text-black">{money(o.total)}</td>
                  <td className="px-5 py-3 text-[10px] text-black/40 uppercase font-mono">{o.payment_method}</td>
                  <td className="px-5 py-3">
                    <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border
                      ${o.payment_status === "paid"     ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                        o.payment_status === "pending"  ? "bg-amber-50 text-amber-700 border-amber-300" :
                        o.payment_status === "refunded" ? "bg-purple-50 text-purple-700 border-purple-300" :
                                                          "bg-stone-50 text-stone-500 border-stone-200"}`}>
                      {o.payment_status || "unpaid"}
                    </span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3">
                    <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)} className="nova-input text-xs py-1 pr-6 w-full">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-16 text-center font-mono text-xs text-black/25 uppercase tracking-widest">No orders match your filter</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
