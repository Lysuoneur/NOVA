import React from "react";
import { getAdminUsers, toggleBanUser, updateUserRole } from "../../api";

export default function AdminUsers() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [actionId, setActionId] = React.useState(null); // tracks in-flight request

  React.useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleBan = async (id) => {
    setActionId(id);
    try {
      const updated = await toggleBanUser(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleRole = async (id, role) => {
    setActionId(id);
    try {
      const updated = await updateUserRole(id, role);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionId(null);
    }
  };

  const filtered = users.filter(u =>
    !search || (u.name + u.email).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-36 bg-black/5 rounded-xl animate-pulse" />
        <div className="h-64 bg-black/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl tracking-tight text-black">Users</h1>
          <p className="font-mono text-[11px] text-black/35 uppercase tracking-[0.18em] mt-1">{users.length} registered accounts</p>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
          className="nova-input text-sm py-2 w-48" />
      </div>

      <div className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/[0.02] border-b border-black/[0.05]">
                {["User", "Email", "Role", "Orders", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-mono uppercase tracking-[0.15em] text-black/30 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className={`border-b border-black/[0.04] transition-colors ${u.banned ? "bg-red-50/60" : "hover:bg-black/[0.015]"}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold font-mono shrink-0">
                        {(u.name || "?")[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-black">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-black/45 font-mono text-xs">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <select value={u.role} disabled={actionId === u.id} onChange={(e) => handleRole(u.id, e.target.value)}
                      className="nova-input text-xs py-1 w-auto">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-sm text-black/40">{u.orders_count ?? 0}</td>
                  <td className="px-5 py-3.5">
                    {u.banned
                      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-700 border border-red-200">BANNED</span>
                      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">ACTIVE</span>
                    }
                  </td>
                  <td className="px-5 py-3.5">
                    <button disabled={actionId === u.id || u.role === "admin"} onClick={() => handleBan(u.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-colors disabled:opacity-30 disabled:cursor-not-allowed
                        ${u.banned ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50" : "border-red-200 text-red-600 hover:bg-red-50"}`}>
                      {actionId === u.id ? "…" : u.banned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-16 text-center font-mono text-xs text-black/25 uppercase tracking-widest">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
