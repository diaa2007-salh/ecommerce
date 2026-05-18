// src/components/admin/RevenueChart.tsx
"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/utils";

interface Props {
  data: { month: string; revenue: number }[];
}

export default function RevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8a8a8e" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#8a8a8e" }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value: number) => [formatPrice(value), "Revenue"]}
          contentStyle={{ borderRadius: 12, border: "1px solid #e5e1d8", fontSize: 13 }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#a855f7"
          strokeWidth={2.5}
          fill="url(#revenueGrad)"
          dot={{ r: 4, fill: "#a855f7", strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
