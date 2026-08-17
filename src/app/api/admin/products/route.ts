import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

interface ProductPayload {
  name: string;
  name_bn: string;
  description?: string;
  description_bn?: string;
  price: number;
  category_id: string | null;
  stock_status: "in_stock" | "out_of_stock";
  image_urls: string[];
}

function validate(body: Partial<ProductPayload>): string | null {
  if (!body.name?.trim()) return "Product name (English) is required";
  if (!body.name_bn?.trim()) return "Product name (Bengali) is required";
  if (typeof body.price !== "number" || body.price < 0) return "Valid price is required";
  if (body.stock_status && !["in_stock", "out_of_stock"].includes(body.stock_status)) {
    return "Invalid stock status";
  }
  return null;
}

export async function POST(req: NextRequest) {
  let body: Partial<ProductPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("products")
    .insert({
      name: body.name!.trim(),
      name_bn: body.name_bn!.trim(),
      description: body.description ?? "",
      description_bn: body.description_bn ?? "",
      price: body.price,
      category_id: body.category_id ?? null,
      stock_status: body.stock_status ?? "in_stock",
      image_urls: body.image_urls ?? [],
    })
    .select()
    .single();

  if (error) {
    console.error("create product error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Bust the cached homepage/shop listing so the new product shows up
  // immediately instead of waiting for the 5-minute revalidation window.
  revalidatePath("/");
  revalidatePath("/shop");

  return NextResponse.json({ product: data });
}
