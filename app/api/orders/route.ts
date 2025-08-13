import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Env variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing Supabase env variables");
}

// Service role client (full DB access)
const svc: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Public auth client (cookie or Bearer token)
function getAuthClient(req?: Request) {
  let token = cookies().get("sb-access-token")?.value;
  if (!token && req) {
    token = req.headers.get("Authorization")?.replace("Bearer ", "") || undefined;
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: token ? { Authorization: `Bearer ${token}` } : undefined },
  });
}

// Order payload type
type OrderPayload = {
  id?: string;
  user_id?: string;
  product_name: string;
  quantity: number;
  price: number;
  fullname: string;
  phone: string;
  address: string;
  alternate_address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  payment_method?: string;
  status?: string;
  total?: number;
  created_at?: string;
  updated_at?: string;
  tracking_number?: string | null;
};

const REQUIRED_FIELDS: (keyof OrderPayload)[] = [
  "product_name",
  "quantity",
  "price",
  "fullname",
  "phone",
  "address",
];

const now = () => new Date().toISOString();
const handleError = (message: string, status: number = 500) =>
  NextResponse.json({ error: message }, { status });

// Generate tracking number
function generateTrackingNumber(): string {
  const prefix = "TRK";
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${randomPart}`;
}

// Get user role from users table
async function getUserRole(user_id?: string) {
  if (!user_id) return null;
  const { data, error } = await svc.from("users").select("role").eq("id", user_id).single();
  if (error || !data) return null;
  return data.role;
}

// Validate order payload
function validateRequiredFields(payload: OrderPayload) {
  for (const field of REQUIRED_FIELDS) {
    if (!payload[field]) return `${field} is required`;
  }
  if (payload.quantity <= 0) return "Quantity must be greater than 0";
  if (payload.price <= 0) return "Price must be greater than 0";
  return null;
}

/** CREATE Order */
export async function POST(req: Request) {
  try {
    const authClient = getAuthClient(req);
    const { data: authData } = await authClient.auth.getUser();
    const user = authData?.user;
    if (!user) return handleError("Unauthorized. Please log in.", 401);

    const body: OrderPayload = await req.json();
    const validationError = validateRequiredFields(body);
    if (validationError) return handleError(validationError, 400);

    const payload: OrderPayload & { created_at: string; updated_at: string } = {
      ...body,
      user_id: user.id,
      alternate_address: body.alternate_address || null,
      city: body.city || null,
      state: body.state || null,
      zip_code: body.zip_code || null,
      payment_method: body.payment_method || "cod",
      status: "pending",
      total: body.price * body.quantity,
      tracking_number: generateTrackingNumber(),
      created_at: now(),
      updated_at: now(),
    };

    const { data, error } = await svc.from("orders").insert(payload).select().single();
    if (error) throw error;

    return NextResponse.json({ order: data }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/orders error:", err);
    return handleError(err.message || "Unknown error");
  }
}

/** READ Orders */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const user_id_param = url.searchParams.get("user_id") || undefined;
    const tracking_number = url.searchParams.get("tracking_number") || undefined;
    const track = url.searchParams.get("track") === "true";

    const authClient = getAuthClient(req);
    const { data: authData } = await authClient.auth.getUser();
    const user = authData?.user;
    if (!user) return handleError("Unauthorized. Please log in.", 401);

    const role = await getUserRole(user.id);
    if (!role) return handleError("Unauthorized.", 401);

    let query = svc.from("orders").select(track
      ? "id,product_name,status,tracking_number,created_at,updated_at"
      : "*"
    ).order("created_at", { ascending: false });

    if (role !== "admin") {
      query = query.eq("user_id", user.id);
    } else if (user_id_param) {
      query = query.eq("user_id", user_id_param);
    } else if (tracking_number) {
      query = query.eq("tracking_number", tracking_number);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(track ? { tracking: data } : { orders: data });
  } catch (err: any) {
    console.error("GET /api/orders error:", err);
    return handleError(err.message || "Unknown error");
  }
}

/** UPDATE Order */
export async function PATCH(req: Request) {
  try {
    const body: OrderPayload & { id?: string } = await req.json();
    if (!body.id) return handleError("id is required", 400);

    const authClient = getAuthClient(req);
    const { data: authData } = await authClient.auth.getUser();
    const user = authData?.user;
    if (!user) return handleError("Unauthorized. Please log in.", 401);

    const role = await getUserRole(user.id);
    if (!role) return handleError("Unauthorized.", 401);

    if ((body.status || body.tracking_number) && role !== "admin") {
      return handleError("Unauthorized to update status/tracking", 403);
    }

    const updatePayload: Partial<OrderPayload & { updated_at: string }> = {
      ...body,
      updated_at: now(),
    };

    if (body.price && body.quantity) {
      updatePayload.total = body.price * body.quantity;
    }

    delete updatePayload.id;
    delete (updatePayload as any).created_at;

    const { data, error } = await svc.from("orders").update(updatePayload).eq("id", body.id).select().single();
    if (error) throw error;

    return NextResponse.json({ order: data });
  } catch (err: any) {
    console.error("PATCH /api/orders error:", err);
    return handleError(err.message || "Unknown error");
  }
}

/** DELETE Order */
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id");
    const body = await req.json().catch(() => ({}));
    id = id || body?.id;
    if (!id) return handleError("id is required", 400);

    const authClient = getAuthClient(req);
    const { data: authData } = await authClient.auth.getUser();
    const user = authData?.user;
    if (!user) return handleError("Unauthorized. Please log in.", 401);

    const role = await getUserRole(user.id);
    if (role !== "admin") {
      return handleError("Unauthorized to delete orders", 403);
    }

    const { data, error } = await svc.from("orders").delete().eq("id", id).select().single();
    if (error) throw error;

    return NextResponse.json({ order: data });
  } catch (err: any) {
    console.error("DELETE /api/orders error:", err);
    return handleError(err.message || "Unknown error");
  }
}
