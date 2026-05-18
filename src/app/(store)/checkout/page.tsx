// src/app/(store)/checkout/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FormData {
  name: string; email: string; address: string;
  city: string; zip: string; country: string;
  card: string; expiry: string; cvv: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "", email: "", address: "",
    city: "", zip: "", country: "US",
    card: "", expiry: "", cvv: "",
  });

  const shipping = subtotal() >= 150 ? 0 : 12;
  const total = subtotal() + shipping;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
          total,
          shipping: { name: form.name, email: form.email, address: form.address, city: form.city, zip: form.zip, country: form.country },
        }),
      });
      if (!res.ok) throw new Error("Order failed");
      const { id } = await res.json();
      clearCart();
      router.push(`/checkout/success?orderId=${id}`);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="mx-auto mb-4 text-ash" size={48} />
        <h1 className="font-display text-2xl mb-4">Your cart is empty</h1>
        <Link href="/products" className="text-brand-600 hover:underline">Continue Shopping →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/products" className="flex items-center gap-2 text-sm text-ash hover:text-obsidian mb-8 transition-colors">
        <ArrowLeft size={16} /> Continue Shopping
      </Link>
      <h1 className="font-display text-3xl mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
          {/* Shipping */}
          <div>
            <h2 className="font-medium text-lg mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "name", label: "Full Name", span: 2 },
                { name: "email", label: "Email", span: 2 },
                { name: "address", label: "Address", span: 2 },
                { name: "city", label: "City", span: 1 },
                { name: "zip", label: "ZIP Code", span: 1 },
              ].map(({ name, label, span }) => (
                <div key={name} className={span === 2 ? "sm:col-span-2" : ""}>
                  <label className="block text-sm text-ash mb-1">{label}</label>
                  <input
                    name={name}
                    value={(form as any)[name]}
                    onChange={handleChange}
                    required
                    className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm text-ash mb-1">Country</label>
                <select name="country" value={form.country} onChange={handleChange}
                  className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400">
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="font-medium text-lg mb-4">Payment</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 mb-4">
              🔒 Demo mode — no real payment is processed.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm text-ash mb-1">Card Number</label>
                <input name="card" placeholder="4242 4242 4242 4242" value={form.card} onChange={handleChange}
                  className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400" />
              </div>
              <div>
                <label className="block text-sm text-ash mb-1">Expiry</label>
                <input name="expiry" placeholder="MM/YY" value={form.expiry} onChange={handleChange}
                  className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400" />
              </div>
              <div>
                <label className="block text-sm text-ash mb-1">CVV</label>
                <input name="cvv" placeholder="123" value={form.cvv} onChange={handleChange}
                  className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-obsidian text-ivory py-4 rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Processing…</> : `Place Order · ${formatPrice(total)}`}
          </button>
        </form>

        {/* Order Summary */}
        <aside className="lg:col-span-2">
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6 sticky top-6">
            <h2 className="font-medium mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={item.product.images?.[0] ?? ""} alt={item.product.name} fill className="object-cover" sizes="56px" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--border)] pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ash">Subtotal</span><span>{formatPrice(subtotal())}</span></div>
              <div className="flex justify-between"><span className="text-ash">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-[var(--border)]">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
