import { getCategories, getProducts } from "@/lib/products";
import { ShopClient } from "./ShopClient";

// This page reads searchParams (category/search/price filters), which
// already forces Next.js to render it dynamically on every request — so
// there's no caching to gain here regardless of this value. Left explicit
// for clarity.
export const revalidate = 0;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; min?: string; max?: string }>;
}) {
  const { category, q, min, max } = await searchParams;

  const minPrice = min ? Number(min) : undefined;
  const maxPrice = max ? Number(max) : undefined;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: category,
      search: q,
      minPrice: minPrice !== undefined && !Number.isNaN(minPrice) ? minPrice : undefined,
      maxPrice: maxPrice !== undefined && !Number.isNaN(maxPrice) ? maxPrice : undefined,
    }),
  ]);

  return (
    <ShopClient
      categories={categories}
      products={products}
      activeCategory={category ?? null}
      initialSearch={q ?? ""}
      initialMinPrice={min ?? ""}
      initialMaxPrice={max ?? ""}
    />
  );
}
