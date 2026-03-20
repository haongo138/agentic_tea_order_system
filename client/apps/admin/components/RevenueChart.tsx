"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data: ChartDataPoint[];
}

function formatRevenue(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#d4952a" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#d4952a" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2ed47e" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#2ed47e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2e42" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "#6b7f96", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatRevenue}
          tick={{ fill: "#6b7f96", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={38}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111923",
            border: "1px solid #1f2e42",
            borderRadius: "10px",
            fontSize: 12,
          }}
          labelStyle={{ color: "#dce8f4", fontWeight: 600 }}
          formatter={(value: number, name: string) => [
            name === "revenue" ? `${formatRevenue(value)} ₫` : `${value} đơn`,
            name === "revenue" ? "Doanh Thu" : "Đơn Hàng",
          ]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#d4952a"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "#d4952a", strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="orders"
          stroke="#2ed47e"
          strokeWidth={1.5}
          fill="url(#ordersGradient)"
          dot={false}
          activeDot={{ r: 3, fill: "#2ed47e", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
