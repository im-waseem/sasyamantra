import { supabase } from "./supabaseClient";

export async function getUserRole(email: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching user role:", error.message);
    return null;
  }

  return data?.is_admin ?? false;
}
