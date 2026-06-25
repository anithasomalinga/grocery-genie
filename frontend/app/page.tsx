"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listReceipts, deleteReceipt, getSummary, ReceiptListItem, Summary } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ReceiptTable from "@/components/ReceiptTable";

export default function Home() {
  const [receipts, setReceipts] = useState<ReceiptListItem[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin: admin } = useAuth();

  const load = async () => {
    setLoading(true);
    const [r, s] = await Promise.all([listReceipts(), getSummary()]);
    setReceipts(r);
    setSummary(s);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    await deleteReceipt(id);
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receipts</h1>
          <p className="text-gray-500 text-sm mt-1">Your grocery purchase history</p>
        </div>
        <Link
          href="/upload"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Upload Receipt
        </Link>
      </div>

      {summary && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Receipts", value: summary.total_receipts },
            { label: "Total Spent", value: `$${summary.total_spend.toFixed(2)}` },
            { label: "Items Tracked", value: summary.total_items },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ReceiptTable receipts={receipts} onDelete={admin ? handleDelete : undefined} />
      )}
    </div>
  );
}
