"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Category, Product } from "@/types";
import { compressImage } from "@/lib/compressImage";

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [nameBn, setNameBn] = useState(product?.name_bn ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [descriptionBn, setDescriptionBn] = useState(product?.description_bn ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [stockStatus, setStockStatus] = useState<"in_stock" | "out_of_stock">(
    product?.stock_status ?? "in_stock"
  );
  const [images, setImages] = useState<string[]>(product?.image_urls ?? []);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", await compressImage(file));

      try {
        const res = await fetch("/api/admin/products/upload-image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Failed to upload image");
          continue;
        }
        setImages((prev) => [...prev, data.url]);
      } catch {
        setError("Network error while uploading image");
      }
    }

    setUploading(false);
    e.target.value = "";
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const priceNum = Number(price);
    if (!name.trim() || !nameBn.trim() || Number.isNaN(priceNum) || priceNum < 0) {
      setError("Please fill in the required fields with valid values.");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      name_bn: nameBn.trim(),
      description,
      description_bn: descriptionBn,
      price: priceNum,
      category_id: categoryId || null,
      stock_status: stockStatus,
      image_urls: images,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to save product");
        setSubmitting(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-secondary">
            Name (English) *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-hairline bg-elevated px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-secondary">
            Name (Bengali) *
          </label>
          <input
            value={nameBn}
            onChange={(e) => setNameBn(e.target.value)}
            className="w-full rounded-xl border border-hairline bg-elevated px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-secondary">
            Description (English)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-hairline bg-elevated px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-secondary">
            Description (Bengali)
          </label>
          <textarea
            value={descriptionBn}
            onChange={(e) => setDescriptionBn(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-hairline bg-elevated px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm text-secondary">Price (৳) *</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="0"
            step="1"
            className="w-full rounded-xl border border-hairline bg-elevated px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-secondary">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-hairline bg-elevated px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-secondary">Stock</label>
          <select
            value={stockStatus}
            onChange={(e) =>
              setStockStatus(e.target.value as "in_stock" | "out_of_stock")
            }
            className="w-full rounded-xl border border-hairline bg-elevated px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
          >
            <option value="in_stock">In stock</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-secondary">Images</label>
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div
              key={url}
              className="relative h-20 w-20 overflow-hidden rounded-xl border border-hairline"
            >
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border border-dashed border-hairline text-xs text-muted hover:border-[color:var(--accent)]">
            {uploading ? "Uploading…" : "+ Add"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-full px-6 py-2.5 text-sm font-medium text-white transition-transform disabled:opacity-50 enabled:hover:scale-[1.02]"
          style={{
            background:
              "linear-gradient(90deg, var(--accent), var(--accent-bright))",
          }}
        >
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Add product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-hairline px-6 py-2.5 text-sm text-secondary hover:text-[color:var(--text-primary)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
