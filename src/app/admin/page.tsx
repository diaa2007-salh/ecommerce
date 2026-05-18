// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Users, Package, TrendingUp } from "lucide-react";
import RevenueChart from "@/components/admin/RevenueChart";

async function getStats() {
  const [orders, products, users] = await Promise.all([
    prisma.order.findMany({ include: { items: true } }),
    prisma.product.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]);
  const revenue = orders.reduce((s, o) => s + o.total, 0);

  // Group revenue by month (last 6 months)
  const now = new Date();
  const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const month = d.toLocaleString("default", { month: "short" });
    const rev = orders
      .filter((o) => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      })
      .reduce((s, o) => s + o.total, 0);
    return { month, revenue: rev };
  });

  const statusCounts = ["PENDING","PROCESSING","SHIPPED","DELIVERED","CANCELLED"].map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));

  return { revenue, orders: orders.length, products, customers: users, revenueByMonth, statusCounts };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Total Revenue",  value: formatPrice(stats.revenue),    icon: TrendingUp, color: "text-brand-600",  bg: "bg-brand-50" },
    { label: "Total Orders",   value: stats.orders.toString(),        icon: ShoppingBag,color: "text-blue-600",   bg: "bg-blue-50" },
    { label: "Products",       value: stats.products.toString(),      icon: Package,    color: "text-amber-600",  bg: "bg-amber-50" },
    { label: "Customers",      value: stats.customers.toString(),     icon: Users,      color: "text-green-600",  bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, Admin.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`${bg} ${color} p-3 rounded-xl`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-semibold text-gray-900 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-medium text-gray-900 mb-6">Revenue — Last 6 Months</h2>
        <RevenueChart data={stats.revenueByMonth} />
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-medium text-gray-900 mb-4">Orders by Status</h2>
        <div className="space-y-3">
          {stats.statusCounts.map(({ status, count }) => {
            const pct = stats.orders > 0 ? Math.round((count / stats.orders) * 100) : 0;
            const colors: Record<string, string> = {
              PENDING: "bg-amber-400", PROCESSING: "bg-blue-400",
              SHIPPED: "bg-brand-500", DELIVERED: "bg-green-500", CANCELLED: "bg-red-400",
            };
            return (
              <div key={status} className="flex items-center gap-4">
                <span className="w-28 text-sm text-gray-600 capitalize">{status.toLowerCase()}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className={`${colors[status]} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-sm text-gray-500 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
