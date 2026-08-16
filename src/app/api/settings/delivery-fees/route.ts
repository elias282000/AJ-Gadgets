import { NextResponse } from "next/server";
import { getDeliveryFees } from "@/lib/products";

export async function GET() {
  const fees = await getDeliveryFees();
  return NextResponse.json(fees);
}
