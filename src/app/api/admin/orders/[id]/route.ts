import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const VALID_STATUSES = ["pending", "shipped", "delivered", "cancelled"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("orders")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("update order status error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
