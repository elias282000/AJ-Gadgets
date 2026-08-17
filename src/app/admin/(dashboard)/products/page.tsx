import Link from "next/link";
import { adminGetProducts } from "@/lib/admin";
import { ProductsTable } from "./ProductsTable";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await adminGetProducts();

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="rounded-full px-4 py-2 text-sm font-medium text-white"
          style={{
            background:
              "linear-gradient(90deg, var(--accent), var(--accent-bright))",
          }}
        >
          + Add product
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
