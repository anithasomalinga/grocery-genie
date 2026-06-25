"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReceiptUpload from "@/components/ReceiptUpload";
import { Receipt } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function UploadPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) router.replace("/login?next=/upload");
  }, [isAdmin, router]);
  const [success, setSuccess] = useState<Receipt | null>(null);

  const handleSuccess = (receipt: Receipt) => {
    setSuccess(receipt);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Receipt processed!</h2>
          <p className="text-gray-500 text-sm mt-1">
            {success.store_name ?? "Unknown store"} &middot;{" "}
            {success.items.length} items &middot;{" "}
            {success.total_amount != null ? `$${success.total_amount.toFixed(2)}` : "—"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSuccess(null)}
            className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Upload another
          </button>
          <button
            onClick={() => router.push(`/receipts/${success.id}`)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-sm font-medium"
          >
            View receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Receipt</h1>
        <p className="text-gray-500 text-sm mt-1">
          We&apos;ll extract items and prices using OCR and AI.
        </p>
      </div>
      <ReceiptUpload onSuccess={handleSuccess} />
    </div>
  );
}
