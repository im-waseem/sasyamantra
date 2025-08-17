"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      // Get user session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Check role from metadata
      const role = user.user_metadata?.role || null;

      if (role === "admin") {
        setIsAdmin(true);
      } else {
        router.push("/"); // redirect non-admins
      }

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) return <p className="p-6">Checking admin permissions...</p>;
  if (!isAdmin) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome, Admin! You have full access to this page.
      </p>
    </div>
  );
}
