"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface AdminNavbarProps {
  user: any;
  role: string | null;
}

export default function AdminNavbar({ user }: AdminNavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/admin" className="font-bold text-xl">
          Admin Dashboard
        </Link>

        <div className="flex items-center space-x-4">
          <span>{user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
