"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { locale } = useLanguage();
  const name = locale === "bn" ? product.name_bn || product.name : product.name;
  const image = product.image_urls?.[0];
  const outOfStock = product.stock_status === "out_of_stock";

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-hairline bg-elevated transition-colors hover:border-[color:var(--accent)]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-elevated-2">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image
          </div>
        )}
        {outOfStock && (
          <div className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white">
            Out of stock
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="line-clamp-1 text-sm font-medium text-[color:var(--text-primary)]">
          {name}
        </p>
        <p className="mt-1 text-sm text-secondary">৳{product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
