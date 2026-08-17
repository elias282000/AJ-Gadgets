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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
    .update({
      name: body.name!.trim(),
      name_bn: body.name_bn!.trim(),
      description: body.description ?? "",
      description_bn: body.description_bn ?? "",
      price: body.price,
      category_id: body.category_id ?? null,
      stock_status: body.stock_status ?? "in_stock",
      image_urls: body.image_urls ?? [],
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("update product error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${id}`);

  return NextResponse.json({ product: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = getSupabaseAdmin();

  const { error } = await admin.from("products").delete().eq("id", id);

  if (error) {
    console.error("delete product error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${id}`);

  return NextResponse.json({ ok: true });
}
