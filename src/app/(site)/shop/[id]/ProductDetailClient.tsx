"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useCartStore } from "@/store/cart";
import { Product } from "@/types";

export function ProductDetailClient({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const name = locale === "bn" ? product.name_bn || product.name : product.name;
  const description =
    locale === "bn"
      ? product.description_bn || product.description
      : product.description;
  const image = product.image_urls?.[0];
  const outOfStock = product.stock_status === "out_of_stock";

  function handleAddToCart() {
    addItem({
      product_id: product.id,
      name: product.name,
      name_bn: product.name_bn,
      price: product.price,
      image_url: image ?? null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-hairline bg-elevated">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              No image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {name}
          </h1>
          <p className="mt-3 text-xl text-[color:var(--accent-glow)]">
            ৳{product.price.toLocaleString()}
          </p>

          {description && (
            <p className="mt-6 whitespace-pre-line text-secondary">
              {description}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="rounded-full px-6 py-3 text-sm font-medium text-white transition-transform disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:scale-[1.02]"
              style={{
                background: outOfStock
                  ? "var(--bg-elevated-2)"
                  : "linear-gradient(90deg, var(--accent), var(--accent-bright))",
              }}
            >
              {outOfStock ? "Out of stock" : "Add to cart"}
            </button>

            {!outOfStock && (
              <button
                onClick={() => {
                  handleAddToCart();
                  router.push("/cart");
                }}
                className="rounded-full border border-hairline px-6 py-3 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:border-[color:var(--accent)]"
              >
                Buy now
              </button>
            )}
          </div>

          {added && (
            <p className="mt-3 text-sm text-[color:var(--accent-glow)]">
              Added to {t.nav.cart.toLowerCase()}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
