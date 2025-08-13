import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const svc = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function GET(req: Request) {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const userId = session.user.id;

    // Get role from "users" table
    const { data: userData, error: userError } = await svc
      .from("users")
      .select("id, email, role")
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        user: {
          id: userData.id,
          email: userData.email,
          role: userData.role,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/auth/me error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
