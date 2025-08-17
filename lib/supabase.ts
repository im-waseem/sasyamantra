import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const svc = createClient(supabaseUrl, supabaseKey);

export function getAuthClient(token?: string) {
  return createClient(supabaseUrl, token || supabaseKey);
}
