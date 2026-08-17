import { getSupabaseAdmin } from "./supabase";
import { Category, Order, Product } from "@/types";

export async function adminGetProducts(): Promise<
  (Product & { categories: { name: string } | null })[]
> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("adminGetProducts error:", error.message);
    return [];
  }
  return (data ?? []) as unknown as (Product & {
    categories: { name: string } | null;
  })[];
}

export async function adminGetProductById(id: string): Promise<Product | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("adminGetProductById error:", error.message);
    return null;
  }
  return data;
}

export async function adminGetCategories(): Promise<Category[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("adminGetCategories error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function adminGetOrders(): Promise<Order[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("adminGetOrders error:", error.message);
    return [];
  }
  return (data ?? []) as unknown as Order[];
}

export async function adminGetSettings(): Promise<{
  deliveryFeeDhaka: number;
  deliveryFeeOutsideDhaka: number;
}> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.from("settings").select("key, value");

  if (error) {
    console.error("adminGetSettings error:", error.message);
    return { deliveryFeeDhaka: 60, deliveryFeeOutsideDhaka: 120 };
  }

  const map = Object.fromEntries((data ?? []).map((s) => [s.key, s.value]));
  return {
    deliveryFeeDhaka: Number(map.delivery_fee_dhaka ?? 60),
    deliveryFeeOutsideDhaka: Number(map.delivery_fee_outside_dhaka ?? 120),
  };
}
