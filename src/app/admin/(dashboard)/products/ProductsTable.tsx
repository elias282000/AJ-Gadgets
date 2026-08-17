"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types";

type AdminProduct = Product & { categories: { name: string } | null };

export function ProductsTable({ products }: { products: AdminProduct[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;

    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to delete product");
        setDeletingId(null);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setDeletingId(null);
    }
  }

  if (products.length === 0) {
    return (
      <p className="mt-10 text-secondary">
        No products yet.{" "}
        <Link href="/admin/products/new" className="text-[color:var(--accent-glow)]">
          Add your first one
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="mt-6">
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-hairline bg-elevated text-left text-secondary">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-hairline last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-hairline bg-elevated">
                      {product.image_urls?.[0] && (
                        <Image
                          src={product.image_urls[0]}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium text-[color:var(--text-primary)]">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-secondary">
                  {product.categories?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-secondary">
                  ৳{product.price.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs ${
                      product.stock_status === "in_stock"
                        ? "bg-[color:var(--accent)]/15 text-[color:var(--accent-glow)]"
                        : "bg-elevated-2 text-muted"
                    }`}
                  >
                    {product.stock_status === "in_stock" ? "In stock" : "Out of stock"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="mr-4 text-[color:var(--accent-glow)] hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deletingId === product.id}
                    className="text-red-400 hover:underline disabled:opacity-50"
                  >
                    {deletingId === product.id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
