// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify, parseImages } from "@/lib/utils";

// GET /api/products/:id
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...product, images: parseImages(product.images) });
}

// PATCH /api/products/:id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data: any = {};

    if (body.name !== undefined) { data.name = body.name; data.slug = slugify(body.name); }
    if (body.description !== undefined) data.description = body.description;
    if (body.price !== undefined) data.price = parseFloat(body.price);
    if (body.comparePrice !== undefined) data.comparePrice = body.comparePrice ? parseFloat(body.comparePrice) : null;
    if (body.stock !== undefined) data.stock = parseInt(body.stock);
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;
    if (body.images !== undefined) data.images = JSON.stringify(Array.isArray(body.images) ? body.images : [body.images]);
    if (body.featured !== undefined) data.featured = Boolean(body.featured);
    if (body.published !== undefined) data.published = Boolean(body.published);

    const product = await prisma.product.update({
      where: { id: params.id },
      data,
      include: { category: true },
    });

    return NextResponse.json({ ...product, images: parseImages(product.images) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE /api/products/:id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
