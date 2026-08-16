import { getCategories, getProducts } from "@/lib/products";
import { ShopClient } from "./ShopClient";

export const revalidate = 0;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(category),
  ]);

  return (
    <ShopClient
      categories={categories}
      products={products}
      activeCategory={category ?? null}
    />
  );
}
