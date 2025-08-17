"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login"); // not logged in → go login
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (error) {
        router.replace("/"); // db error → go home
        return;
      }

      if (data?.is_admin) {
        setAuthorized(true); 
        router.replace("/admin"); // ✅ force admin dashboard
      } else {
        router.replace("."); // ✅ normal user → home
      }
    };

    checkAuth();
  }, [router]);

  // nothing while checking → no flicker
  if (!authorized) return null;

  return <>{children}</>;
}
