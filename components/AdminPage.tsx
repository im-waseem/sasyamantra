"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;

        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        if (profile?.role === "admin") {
          setIsAdmin(true);
        } else {
          router.push("/"); // redirect non-admins
        }
      } catch (err) {
        console.error("Error checking admin:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) return <div>Loading admin dashboard...</div>;
  if (!isAdmin) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, Admin! Manage products, orders, and users here.</p>
      {/* Add admin features/components here */}
    </div>
  );
}
