// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  images: string[];   // parsed from JSON
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: { id: string; name: string; slug: string };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  shipping: ShippingInfo;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: { name: string; email: string } | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Pick<Product, "id" | "name" | "images">;
}

export interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface AdminStats {
  revenue: number;
  orders: number;
  products: number;
  customers: number;
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
}
