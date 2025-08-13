import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const svc = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function POST(req: Request) {
  try {
    const { order_id, phone } = await req.json();

    if (!order_id || !phone) {
      return NextResponse.json({ error: "Order ID and Phone are required" }, { status: 400 });
    }

    const { data, error } = await svc
      .from("orders")
      .select("id, product_name, quantity, price, status, created_at, fullname")
      .eq("id", order_id)
      .eq("phone", phone)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order: data }, { status: 200 });
  } catch (err: any) {
    console.error("Order tracking error:", err);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
