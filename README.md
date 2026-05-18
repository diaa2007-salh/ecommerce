# NexMart — Full-Stack E-Commerce Platform

A modern, production-ready e-commerce platform built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Prisma**, and **Zustand**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET
```

### 3. Set up the database
```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Create tables
npm run db:seed       # Seed with sample products & admin user
```

### 4. Start the dev server
```bash
npm run dev
# → http://localhost:3000
```

---

## 🗂 Folder Structure

```
src/
├── app/
│   ├── (store)/           # Customer storefront (route group)
│   │   ├── layout.tsx     # Header + footer + cart drawer
│   │   ├── page.tsx       # Landing / hero page
│   │   ├── products/
│   │   │   ├── page.tsx        # Catalog with filters
│   │   │   └── [slug]/page.tsx # Product detail
│   │   └── checkout/
│   │       ├── page.tsx        # Checkout form
│   │       └── success/page.tsx
│   ├── admin/             # Admin dashboard
│   │   ├── layout.tsx     # Sidebar + header
│   │   ├── page.tsx       # Analytics overview
│   │   ├── products/page.tsx   # CRUD table
│   │   ├── orders/page.tsx
│   │   └── login/page.tsx
│   └── api/               # Next.js Route Handlers
│       ├── products/
│       │   ├── route.ts        # GET list, POST create
│       │   └── [id]/route.ts   # GET, PATCH, DELETE
│       ├── orders/route.ts
│       └── auth/
│           ├── login/route.ts
│           └── logout/route.ts
├── components/
│   ├── layout/            # StoreHeader
│   ├── store/             # ProductCard, CartDrawer, HeroSection, etc.
│   └── admin/             # AdminSidebar, RevenueChart, etc.
├── lib/
│   ├── prisma.ts          # DB singleton
│   ├── auth.ts            # JWT helpers
│   └── utils.ts           # cn(), formatPrice(), etc.
├── store/
│   └── cartStore.ts       # Zustand cart (persisted)
└── types/
    └── index.ts           # Shared TypeScript types
```

---

## 🔑 Admin Access

- URL: `/admin` (redirects to `/admin/login`)
- Email: `admin@nexmart.com`
- Password: `admin123`

---

## ⚙️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Next.js 14 (App Router, RSC)      |
| Styling     | Tailwind CSS                      |
| Icons       | Lucide React                      |
| State       | Zustand (cart, persisted)         |
| Database    | SQLite (dev) / PostgreSQL (prod)  |
| ORM         | Prisma                            |
| Auth        | JWT (bcryptjs + jsonwebtoken)     |
| Charts      | Recharts                          |

---

## 🛠 Production Checklist

- [ ] Switch `DATABASE_URL` to PostgreSQL
- [ ] Set a strong `JWT_SECRET`
- [ ] Integrate a real payment processor (Stripe)
- [ ] Add image upload (Cloudinary / S3)
- [ ] Add Next.js middleware for admin route protection
- [ ] Deploy on Vercel or Railway
