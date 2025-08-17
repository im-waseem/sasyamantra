"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      // Check if admin
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (error || !data?.is_admin) {
        router.replace("/"); // not admin → send home
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">Checking admin access...</p>;
  }

  return <>{children}</>;
}
