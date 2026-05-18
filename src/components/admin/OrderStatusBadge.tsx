// src/components/admin/OrderStatusBadge.tsx
const config: Record<string, { label: string; className: string }> = {
  PENDING:    { label: "Pending",    className: "bg-amber-100 text-amber-700" },
  PROCESSING: { label: "Processing", className: "bg-blue-100 text-blue-700" },
  SHIPPED:    { label: "Shipped",    className: "bg-purple-100 text-purple-700" },
  DELIVERED:  { label: "Delivered",  className: "bg-green-100 text-green-700" },
  CANCELLED:  { label: "Cancelled",  className: "bg-red-100 text-red-600" },
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const { label, className } = config[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
