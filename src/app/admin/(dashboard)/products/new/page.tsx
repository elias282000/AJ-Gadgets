import { adminGetCategories } from "@/lib/admin";
import { ProductForm } from "../ProductForm";

export const revalidate = 0;

export default async function NewProductPage() {
  const categories = await adminGetCategories();

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
        Add product
      </h1>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
