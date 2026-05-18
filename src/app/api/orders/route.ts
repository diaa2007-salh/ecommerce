// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/orders  — create a new order from checkout
export async function POST(req: NextRequest) {
  try {
    const { items, total, shipping } = await req.json();

    if (!items?.length) return NextResponse.json({ error: "No items" }, { status: 400 });

    const order = await prisma.order.create({
      data: {
        total,
        shipping,
        items: {
          create: items.map((i: { productId: string; quantity: number; price: number }) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Decrement stock for each product
    await Promise.all(
      items.map((i: { productId: string; quantity: number }) =>
        prisma.product.update({
          where: { id: i.productId },
          data: { stock: { decrement: i.quantity } },
        })
      )
    );

    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// GET /api/orders  — list all orders (admin)
export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}
