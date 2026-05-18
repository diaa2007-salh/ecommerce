// src/app/admin/products/page.tsx
import { prisma } from "@/lib/prisma";
import { parseImages, formatPrice } from "@/lib/utils";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
  ]);

  const serialized = products.map((p) => ({
    ...p,
    images: parseImages(p.images),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return <AdminProductsClient products={serialized as any} categories={categories} />;
}
