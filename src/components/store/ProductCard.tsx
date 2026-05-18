// src/components/store/ProductCard.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Heart } from "lucide-react";
import type { Product } from "@/types";

interface Props { product: Product }

export default function ProductCard({ product }: Props) {
  const { addItem, openCart } = useCartStore();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product);
    openCart();
  }

  const image = product.images?.[0] ?? "https://picsum.photos/400/500";
  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card-lift">
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-[var(--border)] mb-3">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount && (
              <span className="bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                -{discount}%
              </span>
            )}
            {product.featured && (
              <span className="bg-obsidian text-ivory text-xs px-2 py-0.5 rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Quick actions overlay */}
          <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="bg-ivory text-obsidian text-sm font-medium px-5 py-2.5 flex items-center gap-2 hover:bg-brand-100 transition-colors"
            >
              <ShoppingBag size={15} />
              Add to Cart
            </button>
          </div>

          {/* Wishlist */}
          <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
            <Heart size={14} />
          </button>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs text-ash mb-1">{product.category?.name}</p>
          <h3 className="font-medium text-sm leading-snug mb-1 group-hover:text-brand-700 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-ash line-through text-xs">{formatPrice(product.comparePrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
