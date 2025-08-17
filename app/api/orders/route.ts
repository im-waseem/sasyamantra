import { NextResponse } from "next/server";

// Define the expected payload
type OrderPayload = {
  productId: string;
  quantity: number;
  customerId?: string;
  notes?: string;
};

// Utility: check if required fields exist
function validateRequiredFields(body: OrderPayload, fields: (keyof OrderPayload)[]) {
  for (const field of fields) {
    if (!(field in body) || body[field] === undefined || body[field] === null) {
      return field;
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body: OrderPayload = await req.json();

    // ✅ Validate required fields
    const missingField = validateRequiredFields(body, ["productId", "quantity"]);
    if (missingField) {
      return NextResponse.json(
        { error: `Missing field: ${missingField}` },
        { status: 400 }
      );
    }

    // ✅ Example logic (replace with DB insert / Supabase)
    const order = {
      id: Date.now().toString(),
      ...body,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
