// src/app/(store)/products/page.tsx
// Product catalogue with server-side filtering + client-side search

import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import ProductCard from "@/components/store/ProductCard";
import ProductFilters from "@/components/store/ProductFilters";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "All Products" };

interface SearchParams {
  category?: string;
  sort?: string;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
}

async function getProducts(params: SearchParams) {
  const where: any = { published: true };

  if (params.category) where.category = { slug: params.category };
  if (params.q) where.name = { contains: params.q };
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = parseFloat(params.minPrice);
    if (params.maxPrice) where.price.lte = parseFloat(params.maxPrice);
  }

  const orderBy: any =
    params.sort === "price-asc"  ? { price: "asc" } :
    params.sort === "price-desc" ? { price: "desc" } :
    params.sort === "newest"     ? { createdAt: "desc" } :
                                   { featured: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
  });

  return products.map((p) => ({ ...p, images: parseImages(p.images) }));
}

async function getCategories() {
  return prisma.category.findMany();
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl mb-2">All Products</h1>
        <p className="text-ash">{products.length} items</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-56 flex-shrink-0">
          <ProductFilters categories={categories} currentParams={searchParams} />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-24 text-ash">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-display text-xl">No products found</p>
              <p className="text-sm mt-2">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
