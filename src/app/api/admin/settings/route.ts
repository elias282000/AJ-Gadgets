import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(req: NextRequest) {
  let body: { deliveryFeeDhaka?: number; deliveryFeeOutsideDhaka?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { deliveryFeeDhaka, deliveryFeeOutsideDhaka } = body;

  if (
    typeof deliveryFeeDhaka !== "number" ||
    deliveryFeeDhaka < 0 ||
    typeof deliveryFeeOutsideDhaka !== "number" ||
    deliveryFeeOutsideDhaka < 0
  ) {
    return NextResponse.json(
      { error: "Both delivery fees must be valid non-negative numbers" },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();

  const [dhakaResult, outsideResult] = await Promise.all([
    admin
      .from("settings")
      .update({ value: String(deliveryFeeDhaka) })
      .eq("key", "delivery_fee_dhaka"),
    admin
      .from("settings")
      .update({ value: String(deliveryFeeOutsideDhaka) })
      .eq("key", "delivery_fee_outside_dhaka"),
  ]);

  if (dhakaResult.error || outsideResult.error) {
    const message = dhakaResult.error?.message ?? outsideResult.error?.message;
    console.error("update settings error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
