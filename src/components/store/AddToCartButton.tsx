// src/components/store/AddToCartButton.tsx
"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/types";

export default function AddToCartButton({ product, disabled }: { product: Product; disabled?: boolean }) {
  const { addItem, openCart } = useCartStore();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product);
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-3 py-4 text-sm font-medium transition-all duration-300 ${
        added
          ? "bg-green-600 text-white"
          : disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-obsidian text-ivory hover:bg-brand-700"
      }`}
    >
      {added ? <><Check size={18} /> Added to Cart</> : <><ShoppingBag size={18} /> Add to Cart</>}
    </button>
  );
}
