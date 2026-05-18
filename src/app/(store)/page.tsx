// src/app/(store)/page.tsx
// Landing page — Hero + Featured Products + Categories

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import ProductCard from "@/components/store/ProductCard";
import HeroSection from "@/components/store/HeroSection";

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true, published: true },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return products.map((p) => ({ ...p, images: parseImages(p.images) }));
}

async function getCategories() {
  return prisma.category.findMany({ take: 4 });
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <HeroSection />

      {/* Categories strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-[var(--border)] p-8 hover:border-brand-400 transition-all duration-300 card-lift"
            >
              <div className="text-3xl mb-3">
                {{ clothing: "👔", accessories: "⌚", footwear: "👟", home: "🏡" }[cat.slug] ?? "✦"}
              </div>
              <h3 className="font-medium">{cat.name}</h3>
              <span className="text-sm text-ash group-hover:text-brand-600 transition-colors">
                Shop →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl">Featured Collection</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <div
              key={product.id}
              className={`animate-fade-up opacity-0 stagger-${Math.min(i + 1, 5)}`}
              style={{ animationFillMode: "forwards" }}
            >
              <ProductCard product={product as any} />
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="bg-obsidian text-ivory py-24 px-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-ash mb-4">New Season</p>
        <h2 className="font-display text-4xl md:text-6xl mb-6 text-balance">
          Less, but better.
        </h2>
        <p className="text-ash max-w-md mx-auto mb-8 leading-relaxed">
          We believe in buying fewer things and wearing them longer.
          Each piece is chosen to last a decade.
        </p>
        <Link
          href="/products"
          className="inline-block border border-ivory px-8 py-3 text-sm tracking-wider hover:bg-ivory hover:text-obsidian transition-all duration-300"
        >
          SHOP THE EDIT
        </Link>
      </section>
    </>
  );
}
