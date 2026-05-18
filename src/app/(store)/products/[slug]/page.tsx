// src/app/(store)/products/[slug]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseImages, formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/store/AddToCartButton";
import Image from "next/image";
import type { Metadata } from "next";

interface Props { params: { slug: string } }

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, published: true },
    include: { category: true },
  });
  if (!product) return null;
  return { ...product, images: parseImages(product.images) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return { title: product?.name ?? "Product Not Found" };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const inStock = product.stock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] relative rounded-2xl overflow-hidden bg-white border border-[var(--border)]">
            <Image
              src={product.images[0] ?? "https://picsum.photos/800/1000"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div className="lg:pt-4">
          <p className="text-sm text-ash uppercase tracking-wider mb-3">
            {product.category.name}
          </p>
          <h1 className="font-display text-3xl md:text-4xl mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-ash line-through text-lg">
                {formatPrice(product.comparePrice)}
              </span>
            )}
            {product.comparePrice && (
              <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-medium">
                {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
              </span>
            )}
          </div>

          <p className="text-ash leading-relaxed mb-8">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-8">
            <span className={`w-2 h-2 rounded-full ${inStock ? "bg-green-500" : "bg-red-400"}`} />
            <span className="text-sm text-ash">
              {inStock ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* CTA */}
          <AddToCartButton product={product as any} disabled={!inStock} />

          {/* Meta */}
          <div className="mt-10 pt-8 border-t border-[var(--border)] space-y-3">
            {[
              ["Free shipping", "On orders over $150"],
              ["Easy returns", "30-day return policy"],
              ["Secure checkout", "SSL encrypted payment"],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3 text-sm">
                <span className="font-medium w-32">{title}</span>
                <span className="text-ash">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
