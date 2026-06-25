"use client";

import Link from "next/link";
import { ReceiptListItem } from "@/lib/api";

interface Props {
  receipts: ReceiptListItem[];
  onDelete?: (id: number) => void;
}

export default function ReceiptTable({ receipts, onDelete }: Props) {
  if (receipts.length === 0) {
    return (
      <p className="text-gray-400 text-center py-10">
        No receipts yet. Upload one to get started.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Store</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3 text-right">Items</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {receipts.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-800">
                {r.store_name ?? <span className="text-gray-400">Unknown</span>}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {r.purchase_date ?? <span className="text-gray-400">—</span>}
              </td>
              <td className="px-4 py-3 text-right font-mono">
                {r.total_amount != null ? `$${r.total_amount.toFixed(2)}` : "—"}
              </td>
              <td className="px-4 py-3 text-right text-gray-500">{r.item_count}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex gap-3 justify-end">
                  <Link
                    href={`/receipts/${r.id}`}
                    className="text-green-600 hover:underline"
                  >
                    View
                  </Link>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(r.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
