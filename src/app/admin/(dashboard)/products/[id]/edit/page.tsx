import { notFound } from "next/navigation";
import { adminGetCategories, adminGetProductById } from "@/lib/admin";
import { ProductForm } from "../../ProductForm";

export const revalidate = 0;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    adminGetProductById(id),
    adminGetCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
        Edit product
      </h1>
      <div className="mt-6">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}
