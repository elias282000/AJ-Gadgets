import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { ProductDetailClient } from "./ProductDetailClient";

// Cached the same way as the homepage — see comment there. Busted
// immediately on edit/delete via revalidatePath in the admin API routes.
export const revalidate = 300;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
