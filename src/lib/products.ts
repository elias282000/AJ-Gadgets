import { supabase } from "./supabase";
import { Category, Product } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("getCategories error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*, categories!inner(slug)")
    .order("created_at", { ascending: false });

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getProducts error:", error.message);
    return [];
  }
  return (data ?? []) as unknown as Product[];
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("stock_status", "in_stock")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedProducts error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getProductById error:", error.message);
    return null;
  }
  return data;
}

export async function getDeliveryFees(): Promise<{
  dhaka: number;
  outsideDhaka: number;
}> {
  const { data, error } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["delivery_fee_dhaka", "delivery_fee_outside_dhaka"]);

  if (error || !data) {
    console.error("getDeliveryFees error:", error?.message);
    return { dhaka: 60, outsideDhaka: 120 };
  }

  const map = Object.fromEntries(data.map((row) => [row.key, row.value]));
  return {
    dhaka: Number(map.delivery_fee_dhaka ?? 60),
    outsideDhaka: Number(map.delivery_fee_outside_dhaka ?? 120),
  };
}
