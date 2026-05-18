// prisma/seed.ts
// Run: npm run db:seed

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@nexmart.com" },
    update: {},
    create: {
      email: "admin@nexmart.com",
      name: "Admin",
      password: await bcrypt.hash("admin123", 10),
      role: Role.ADMIN,
    },
  });

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "clothing" }, update: {}, create: { name: "Clothing", slug: "clothing" } }),
    prisma.category.upsert({ where: { slug: "accessories" }, update: {}, create: { name: "Accessories", slug: "accessories" } }),
    prisma.category.upsert({ where: { slug: "footwear" }, update: {}, create: { name: "Footwear", slug: "footwear" } }),
    prisma.category.upsert({ where: { slug: "home" }, update: {}, create: { name: "Home", slug: "home" } }),
  ]);

  // Products
  const products = [
    { name: "Oversized Linen Blazer", slug: "oversized-linen-blazer", price: 189, comparePrice: 240, stock: 42, categoryId: categories[0].id, featured: true, description: "Relaxed silhouette, breathable linen-cotton blend. Unlined for lightweight versatility.", images: JSON.stringify(["https://images.unsplash.com/photo-1594938298603-c8148c4b8e5d?w=800"]) },
    { name: "Merino Turtleneck", slug: "merino-turtleneck", price: 120, stock: 28, categoryId: categories[0].id, featured: true, description: "100% extra-fine merino wool. Ribbed cuffs and hem. Machine washable.", images: JSON.stringify(["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"]) },
    { name: "Wide-Leg Trousers", slug: "wide-leg-trousers", price: 145, comparePrice: 180, stock: 35, categoryId: categories[0].id, description: "High-rise tailored trousers in premium Italian wool blend.", images: JSON.stringify(["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800"]) },
    { name: "Leather Card Holder", slug: "leather-card-holder", price: 65, stock: 80, categoryId: categories[1].id, featured: true, description: "Full-grain vegetable-tanned leather. Holds 4–6 cards.", images: JSON.stringify(["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800"]) },
    { name: "Cashmere Scarf", slug: "cashmere-scarf", price: 98, comparePrice: 130, stock: 55, categoryId: categories[1].id, description: "Grade-A Mongolian cashmere, 200×70 cm. Naturally hypoallergenic.", images: JSON.stringify(["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800"]) },
    { name: "Minimalist Watch", slug: "minimalist-watch", price: 325, stock: 18, categoryId: categories[1].id, featured: true, description: "Sapphire crystal face, Japanese quartz movement, 40mm stainless case.", images: JSON.stringify(["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"]) },
    { name: "Suede Chelsea Boots", slug: "suede-chelsea-boots", price: 275, comparePrice: 340, stock: 22, categoryId: categories[2].id, featured: true, description: "Hand-stitched suede upper, leather lining, rubber sole.", images: JSON.stringify(["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"]) },
    { name: "Canvas Sneakers", slug: "canvas-sneakers", price: 95, stock: 64, categoryId: categories[2].id, description: "Organic cotton canvas, vulcanised rubber sole. Unisex sizing.", images: JSON.stringify(["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800"]) },
    { name: "Ceramic Pour-Over Set", slug: "ceramic-pour-over-set", price: 78, stock: 30, categoryId: categories[3].id, description: "Handthrown ceramic dripper, carafe, and stand. Each piece unique.", images: JSON.stringify(["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"]) },
    { name: "Linen Cushion Cover", slug: "linen-cushion-cover", price: 42, stock: 90, categoryId: categories[3].id, description: "Stone-washed French linen, concealed zipper, 50×50 cm.", images: JSON.stringify(["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"]) },
  ];

  for (const p of products) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  console.log("✅ Seed complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
