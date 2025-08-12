import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing SUPABASE env variables");
}

const svc = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * CREATE Order
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Required fields
    const required = [
      "product_name",
      "quantity",
      "price",
      "fullname",
      "phone",
      "address",
    ];

    for (const k of required) {
      if (!body[k]) {
        return NextResponse.json({ error: `${k} is required` }, { status: 400 });
      }
    }

    const payload = {
      user_id: body.user_id || null,
      product_name: body.product_name,
      quantity: body.quantity,
      price: body.price,
      fullname: body.fullname,
      phone: body.phone,
      address: body.address,
      alternate_address: body.alternate_address || null,
      city: body.city || null,
      state: body.state || null,
      zip: body.zip || null,
      payment_method: body.payment_method || "cod",
      status: body.status || "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await svc
      .from("orders")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ order: data }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * READ Orders
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");

    let query = svc.from("orders").select("*").order("created_at", { ascending: false });

    if (user_id) {
      query = query.eq("user_id", user_id);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ orders: data }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * UPDATE Order
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updatePayload: any = { ...body };
    delete updatePayload.id;
    updatePayload.updated_at = new Date().toISOString();

    const { data, error } = await svc
      .from("orders")
      .update(updatePayload)
      .eq("id", body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ order: data }, { status: 200 });
  } catch (err: any) {
    console.error("PATCH /api/orders error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE Order
 */
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id");

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body?.id;
    }

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { data, error } = await svc.from("orders").delete().eq("id", id).select().single();

    if (error) throw error;

    return NextResponse.json({ order: data }, { status: 200 });
  } catch (err: any) {
    console.error("DELETE /api/orders error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
