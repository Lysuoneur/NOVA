import React from "react";
import { deleteProduct as apiDelete, updateProduct as apiUpdate, createProduct, getProducts, normalizeProduct } from "../../api";
import { PRODUCTS as FALLBACK_PRODUCTS } from "../../data/novaData";

const CATEGORIES = ["Tops", "Bottoms", "Outerwear", "Accessories"];
const BRANDS = ["Hades Studio", "SWE", "Now Saigon", "Whose Studio", "COZY", "Gamble", "Unkrush"];
const BADGES = ["", "HOT", "NEW", "SALE"];

function BadgePill({ badge }) {
  if (!badge) return <span className="text-black/25 text-xs">—</span>;
  const cls =
    badge === "HOT"  ? "bg-red-100 text-red-700"   :
    badge === "NEW"  ? "bg-blue-100 text-blue-700"  :
    badge === "SALE" ? "bg-amber-100 text-amber-700" :
    "bg-black/5 text-black/50";
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${cls}`}>{badge}</span>;
}

// ── Edit Modal ─────────────────────────────────────────────────────────────
function EditModal({ product, onClose, onSave }) {
  const [form, setForm] = React.useState({
    title:    product.title    || product.name || "",
    brand:    product.brand    || BRANDS[0],
    category: product.category || CATEGORIES[0],
    price:    String(product.price ?? ""),
    stock:    String(product.stock ?? ""),
    image:    product.image    || "",
    badge:    product.badge    || "",
  });
  const [saving, setSaving] = React.useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(product.id, {
        name:     form.title,
        title:    form.title,
        brand:    form.brand,
        category: form.category,
        price:    parseFloat(form.price) || 0,
        stock:    parseInt(form.stock, 10) || 0,
        image:    form.image || null,
        badge:    form.badge || null,
      });
      onClose();
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.07]">
          <div>
            <div className="font-semibold text-sm text-black">Edit Product</div>
            <div className="font-mono text-[10px] text-black/35 mt-0.5 truncate max-w-[280px]">{form.title || "—"}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-black/5 flex items-center justify-center text-black/40 hover:text-black transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Image preview + URL */}
          <div className="flex gap-4 items-start">
            <img
              src={form.image || `https://placehold.co/80x100/f5f5f5/999?text=${form.category}`}
              alt={form.title}
              className="w-16 h-20 object-cover rounded-xl bg-black/5 flex-shrink-0 border border-black/[0.07]"
              onError={(e) => { e.target.src = `https://placehold.co/80x100/f5f5f5/999?text=IMG`; }}
            />
            <div className="flex-1">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Image URL</label>
              <input className="nova-input text-xs" placeholder="https://..." value={form.image} onChange={set("image")} />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Product Name</label>
            <input className="nova-input" placeholder="Product name" required value={form.title} onChange={set("title")} />
          </div>

          {/* Brand + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Brand</label>
              <select className="nova-input" value={form.brand} onChange={set("brand")}>
                {BRANDS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Category</label>
              <select className="nova-input" value={form.category} onChange={set("category")}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Price + Stock + Badge */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Price ($)</label>
              <input className="nova-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={set("price")} />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Stock</label>
              <input className="nova-input" type="number" min="0" placeholder="0" value={form.stock} onChange={set("stock")} />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Badge</label>
              <select className="nova-input" value={form.badge} onChange={set("badge")}>
                <option value="">None</option>
                {BADGES.filter(Boolean).map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm text-black/50 hover:text-black hover:border-black/25 transition-colors font-mono text-xs">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-black text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-black/80 transition-colors disabled:opacity-50">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AdminProducts() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [catFilter, setCatFilter] = React.useState("All");
  const [showForm, setShowForm] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [draft, setDraft] = React.useState({ title: "", brand: "Hades Studio", category: "Tops", price: "", stock: "10", image: "" });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      try {
        const liveProducts = await getProducts();
        if (active) setProducts(Array.isArray(liveProducts) ? liveProducts : FALLBACK_PRODUCTS.map(normalizeProduct));
      } catch (err) {
        console.error("Failed to load products", err);
        if (active) setProducts(FALLBACK_PRODUCTS.map(normalizeProduct));
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProducts();
    return () => { active = false; };
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = catFilter === "All" || p.category === catFilter;
    const name = p.name || p.title || "";
    const brand = p.brand || "";
    const matchSearch = !search || (name + brand).toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Add ──
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    setSaving(true);
    try {
      const created = await createProduct({
        name:     draft.title,
        brand:    draft.brand,
        category: draft.category,
        price:    parseFloat(draft.price) || 0,
        stock:    parseInt(draft.stock, 10) || 10,
        image:    draft.image || null,
        sizes:    ["S", "M", "L"],
        active:   true,
      });
      setProducts((prev) => [created, ...prev]);
      setDraft({ title: "", brand: "Hades Studio", category: "Tops", price: "", stock: "10", image: "" });
      setShowForm(false);
    } catch (err) {
      alert("Failed to create product: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await apiDelete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  // ── Save edit ──
  const handleSaveEdit = async (id, data) => {
    const updated = await apiUpdate(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-10 w-44 bg-black/5 rounded-xl animate-pulse" />
        <div className="h-64 bg-black/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Edit modal */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl tracking-tight text-black">Products</h1>
          <p className="font-mono text-[11px] text-black/35 uppercase tracking-[0.18em] mt-1">{products.length} items in catalogue</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white font-mono text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-black/80 transition-colors flex-shrink-0"
        >
          {showForm ? "✕ Cancel" : "+ Add Product"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white border border-black/[0.07] rounded-2xl p-5 grid md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Title</label>
            <input className="nova-input" placeholder="Product name" required value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Brand</label>
            <select className="nova-input" value={draft.brand} onChange={(e) => setDraft((d) => ({ ...d, brand: e.target.value }))}>
              {BRANDS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Category</label>
            <select className="nova-input" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Price ($)</label>
            <input className="nova-input" type="number" min="0" step="0.01" placeholder="0.00" value={draft.price}
              onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Image URL (optional)</label>
            <input className="nova-input" placeholder="https://..." value={draft.image}
              onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))} />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-black/35 mb-1.5">Stock</label>
            <input className="nova-input" type="number" min="0" placeholder="10" value={draft.stock}
              onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value }))} />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={saving}
              className="nova-pill solid w-full py-2.5 disabled:opacity-50 font-mono text-xs uppercase tracking-widest">
              {saving ? "Adding…" : "Add →"}
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
          className="nova-input text-sm py-2 w-44" />
        <div className="flex gap-1.5">
          {["All", ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all
                ${catFilter === c ? "bg-black text-white border-black" : "bg-white border-black/10 text-black/50 hover:border-black/25"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto font-mono text-[10px] text-black/30">{filtered.length} results</div>
      </div>

      {/* Table */}
      <div className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-black/[0.02] border-b border-black/[0.05]">
              {["", "Product", "Category", "Price", "Stock", "Badge", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-[0.15em] text-black/30 font-normal first:w-16">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-black/[0.04] hover:bg-black/[0.015] transition-colors group">

                {/* Image */}
                <td className="px-4 py-2.5">
                  <img
                    src={p.image}
                    alt={p.name || p.title}
                    className="w-34 h-34 object-cover rounded-xl bg-black/5 border border-black/[0.06]"
                    onError={(e) => { e.target.src = `https://placehold.co/80x100/f5f5f5/999?text=${p.category}`; }}
                  />
                </td>

                {/* Name + brand */}
                <td className="px-4 py-2.5">
                  <div className="font-semibold text-sm text-black">{p.name || p.title}</div>
                  <div className="text-xs text-black/35 mt-0.5 font-mono">{p.brand}</div>
                </td>

                <td className="px-4 py-2.5">
                  <span className="text-[10px] bg-black/5 text-black/50 px-2.5 py-1 rounded-full font-mono font-medium">{p.category}</span>
                </td>

                <td className="px-4 py-2.5 font-mono text-sm font-bold text-black">${Number(p.price).toFixed(2)}</td>

                <td className="px-4 py-2.5 font-mono text-sm text-black/40">{p.stock ?? "—"}</td>

                <td className="px-4 py-2.5"><BadgePill badge={p.badge} /></td>

                {/* Actions */}
                <td className="px-4 py-2.5">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="text-xs px-2.5 py-1.5 border border-black/15 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all text-black/60">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs px-2.5 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center font-mono text-xs text-black/25 uppercase tracking-widest">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
