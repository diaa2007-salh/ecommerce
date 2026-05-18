// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify, parseImages } from "@/lib/utils";

// GET /api/products
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const featured = searchParams.get("featured");

  const where: any = { published: true };
  if (category) where.category = { slug: category };
  if (q) where.name = { contains: q };
  if (featured) where.featured = true;

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    products.map((p) => ({ ...p, images: parseImages(p.images) }))
  );
}

// POST /api/products  (admin only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, comparePrice, stock, categoryId, images, featured, published } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug: slugify(name),
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock),
        categoryId,
        images: JSON.stringify(Array.isArray(images) ? images : [images]),
        featured: Boolean(featured),
        published: published !== false,
      },
      include: { category: true },
    });

    return NextResponse.json({ ...product, images: parseImages(product.images) }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
