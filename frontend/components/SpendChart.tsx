"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { SpendByCategory } from "@/lib/api";

const COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
];

interface Props {
  data: SpendByCategory[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatTooltip = (v: any) => [`$${Number(v).toFixed(2)}`, "Spend"] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPieLabel = (props: any) => {
  const { category, percent } = props as { category: string; percent: number };
  return `${category} ${((percent ?? 0) * 100).toFixed(0)}%`;
};

export default function SpendChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-gray-400 text-center py-10">
        No spend data yet. Upload some receipts first.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Spend by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 60 }}>
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11 }}
              angle={-40}
              textAnchor="end"
              interval={0}
            />
            <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={formatTooltip} />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Share of Spend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={renderPieLabel}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={formatTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
