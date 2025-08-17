// app/admin/dashboard/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies });

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check admin status
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (error || !profile?.is_admin) {
    redirect("/"); // send non-admins home
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome, Admin!</p>
    </div>
  );
}
