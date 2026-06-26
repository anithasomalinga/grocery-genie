"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listReceipts, deleteReceipt, getSummary, ReceiptListItem, Summary } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ReceiptTable from "@/components/ReceiptTable";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
      <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
      <div className="h-7 w-28 bg-gray-200 rounded" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="bg-gray-50 h-10" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-16 ml-auto" />
        </div>
      ))}
    </div>
  );
}

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
        {admin && (
          <Link
            href="/upload"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Upload Receipt
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          summary && [
            { label: "Receipts", value: summary.total_receipts },
            { label: "Total Spent", value: `$${summary.total_spend.toFixed(2)}` },
            { label: "Items Tracked", value: summary.total_items },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
          ))
        )}
      </div>

      {loading ? <SkeletonTable /> : (
        <ReceiptTable receipts={receipts} onDelete={admin ? handleDelete : undefined} />
      )}
    </div>
  );
}
