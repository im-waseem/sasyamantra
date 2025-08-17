"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "user" | "admin";
}) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      const userRole = data.user.user_metadata?.role || "user";
      setUserRole(userRole);
      setLoading(false);

      // Role mismatch redirect
      if (role === "admin" && userRole !== "admin") router.push("/dashboard/user");
      if (role === "user" && userRole !== "user") router.push("/dashboard/admin");
    };
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}
