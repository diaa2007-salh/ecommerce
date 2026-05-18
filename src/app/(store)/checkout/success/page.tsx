// src/app/(store)/checkout/success/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <CheckCircle className="mx-auto mb-6 text-green-500" size={56} />
      <h1 className="font-display text-3xl mb-3">Order Confirmed!</h1>
      <p className="text-ash mb-2">Thank you for your purchase.</p>
      {orderId && (
        <p className="text-sm text-ash mb-8">
          Order ID: <span className="font-mono text-obsidian">{orderId}</span>
        </p>
      )}
      <Link
        href="/products"
        className="inline-block bg-obsidian text-ivory px-8 py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
