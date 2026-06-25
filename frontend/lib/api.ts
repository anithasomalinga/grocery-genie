import { getToken, clearToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handleUnauthorized(res: Response): void {
  if (res.status === 401) {
    clearToken();
    window.location.href = "/login";
  }
}

export interface ReceiptItem {
  id: number;
  receipt_id: number;
  name: string;
  price: number;
  quantity: number;
  category: string | null;
}

export interface Receipt {
  id: number;
  store_name: string | null;
  purchase_date: string | null;
  total_amount: number | null;
  image_path: string | null;
  created_at: string;
  items: ReceiptItem[];
}

export interface ReceiptListItem {
  id: number;
  store_name: string | null;
  purchase_date: string | null;
  total_amount: number | null;
  created_at: string;
  item_count: number;
}

export interface SpendByCategory {
  category: string;
  total: number;
}

export interface Summary {
  total_receipts: number;
  total_spend: number;
  total_items: number;
}

export async function uploadReceipt(file: File): Promise<{ receipt: Receipt; message: string }> {
  const form = new FormData();
  form.append("file", file);
  let res: Response;
  try {
    res = await fetch(`${API_URL}/receipts/upload`, {
      method: "POST",
      headers: authHeaders(),
      body: form,
    });
  } catch {
    throw new Error(`Cannot reach backend at ${API_URL} — is it running?`);
  }
  if (!res.ok) {
    handleUnauthorized(res);
    const body = await res.text().catch(() => res.statusText);
    throw new Error(body || `Server error ${res.status}`);
  }
  return res.json();
}

export async function listReceipts(): Promise<ReceiptListItem[]> {
  const res = await fetch(`${API_URL}/receipts`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getReceipt(id: number): Promise<Receipt> {
  const res = await fetch(`${API_URL}/receipts/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteReceipt(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/receipts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    handleUnauthorized(res);
    throw new Error(await res.text());
  }
}

export async function getSpendByCategory(months?: number): Promise<SpendByCategory[]> {
  const url = months
    ? `${API_URL}/analytics/spend-by-category?months=${months}`
    : `${API_URL}/analytics/spend-by-category`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getSummary(): Promise<Summary> {
  const res = await fetch(`${API_URL}/analytics/summary`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
