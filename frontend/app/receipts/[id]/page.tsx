"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getReceipt, deleteReceipt, Receipt } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ReceiptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin: admin } = useAuth();

  useEffect(() => {
    getReceipt(Number(id))
      .then(setReceipt)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this receipt?")) return;
    await deleteReceipt(Number(id));
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !receipt) {
    return <p className="text-red-600 text-center py-10">{error ?? "Receipt not found"}</p>;
  }

  const categoryTotals = receipt.items.reduce<Record<string, number>>((acc, item) => {
    const cat = item.category ?? "Other";
    acc[cat] = (acc[cat] ?? 0) + item.price;
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{receipt.store_name ?? "Unknown Store"}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {receipt.purchase_date ?? "Date unknown"} &middot; {receipt.items.length} items
          </p>
        </div>
        {admin && (
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {receipt.image_path && (
        <img
          src={`${API_URL}${receipt.image_path}`}
          alt="Receipt"
          className="rounded-lg border border-gray-200 max-h-64 object-contain w-full bg-gray-50"
        />
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">Items</h2>
          <span className="text-lg font-bold text-gray-900">
            ${receipt.total_amount?.toFixed(2) ?? "—"}
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-center">Qty</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {receipt.items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-800">{item.name}</td>
                <td className="px-4 py-2 text-center text-gray-500">{item.quantity}</td>
                <td className="px-4 py-2">
                  {item.category && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-right font-mono text-gray-900 font-medium">${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {Object.keys(categoryTotals).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Spend by Category</h2>
          <div className="space-y-2">
            {Object.entries(categoryTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, total]) => (
                <div key={cat} className="flex justify-between text-sm">
                  <span className="text-gray-600">{cat}</span>
                  <span className="font-mono text-gray-900">${total.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
