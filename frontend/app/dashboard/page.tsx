"use client";

import { useEffect, useState } from "react";
import { getSpendByCategory, SpendByCategory } from "@/lib/api";
import SpendChart from "@/components/SpendChart";

const FILTERS = [
  { label: "All time", months: undefined },
  { label: "Last 3 months", months: 3 },
  { label: "Last month", months: 1 },
];

export default function DashboardPage() {
  const [data, setData] = useState<SpendByCategory[]>([]);
  const [months, setMonths] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSpendByCategory(months).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [months]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Spend Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Grocery spend broken down by category</p>
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setMonths(f.months)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                months === f.months
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <SpendChart data={data} />
        )}
      </div>

      {!loading && data.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Total Spend</th>
                <th className="px-4 py-3 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row) => {
                const grandTotal = data.reduce((s, r) => s + r.total, 0);
                return (
                  <tr key={row.category} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{row.category}</td>
                    <td className="px-4 py-3 text-right font-mono">${row.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {((row.total / grandTotal) * 100).toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
