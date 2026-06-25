"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function NavBar() {
  const router = useRouter();
  const { isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link href="/" className="font-bold text-green-600 text-lg">
          Grocery Genie
        </Link>
        <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
          Receipts
        </Link>
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm">
          Dashboard
        </Link>
        {isAdmin && (
          <Link href="/upload" className="text-gray-600 hover:text-gray-900 text-sm">
            Upload
          </Link>
        )}
        <div className="ml-auto">
          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm text-green-600 hover:text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
