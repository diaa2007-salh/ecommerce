// src/components/admin/AdminProductsClient.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Loader2, Search } from "lucide-react";
import Image from "next/image";
import type { Product, Category } from "@/types";

interface Props {
  products: Product[];
  categories: Category[];
}

const emptyForm = {
  name: "", description: "", price: "", comparePrice: "",
  stock: "", categoryId: "", images: "", featured: false, published: true,
};

export default function AdminProductsClient({ products: initial, categories }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; editing: Product | null }>({ open: false, editing: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setForm(emptyForm);
    setModal({ open: true, editing: null });
  }

  function openEdit(p: Product) {
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      comparePrice: p.comparePrice ? String(p.comparePrice) : "",
      stock: String(p.stock),
      categoryId: p.categoryId,
      images: p.images?.[0] ?? "",
      featured: p.featured,
      published: p.published,
    });
    setModal({ open: true, editing: p });
  }

  function closeModal() {
    setModal({ open: false, editing: null });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = { ...form, images: [form.images] };
      const url = modal.editing ? `/api/products/${modal.editing.id}` : "/api/products";
      const method = modal.editing ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Failed");
      closeModal();
      router.refresh();
      // Optimistic local update
      const updated = await res.json();
      if (modal.editing) {
        setProducts((ps) => ps.map((p) => p.id === updated.id ? updated : p));
      } else {
        setProducts((ps) => [updated, ...ps]);
      }
    } catch { alert("Save failed."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((ps) => ps.filter((p) => p.id !== id));
    setDeleting(null);
  }

  function f(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} total products</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />}
                      </div>
                      <span className="font-medium text-gray-900 truncate max-w-[180px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.category?.name}</td>
                  <td className="px-5 py-3 font-medium">{formatPrice(p.price)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.stock > 10 ? "bg-green-100 text-green-700" : p.stock > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                      {p.stock > 0 ? `${p.stock} left` : "Out"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)}
                        className="p-1.5 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors text-gray-400">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                        className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400">
                        {deleting === p.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold">{modal.editing ? "Edit Product" : "New Product"}</h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-full"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { key: "name", label: "Name" },
                { key: "description", label: "Description" },
                { key: "price", label: "Price ($)", type: "number" },
                { key: "comparePrice", label: "Compare Price ($)", type: "number" },
                { key: "stock", label: "Stock", type: "number" },
                { key: "images", label: "Image URL" },
              ].map(({ key, label, type = "text" }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input type={type} value={(form as any)[key]} onChange={(e) => f(key, e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select value={form.categoryId} onChange={(e) => f("categoryId", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-6">
                {[{ key: "featured", label: "Featured" }, { key: "published", label: "Published" }].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={(form as any)[key]}
                      onChange={(e) => f(key, e.target.checked)}
                      className="w-4 h-4 accent-brand-600" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3 justify-end">
              <button onClick={closeModal} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 disabled:opacity-60 flex items-center gap-2">
                {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
