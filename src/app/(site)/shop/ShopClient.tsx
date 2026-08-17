"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";
import { ProductCard } from "@/components/ProductCard";
import { Category, Product } from "@/types";

export function ShopClient({
  categories,
  products,
  activeCategory,
}: {
  categories: Category[];
  products: Product[];
  activeCategory: string | null;
}) {
  const { locale, t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {t.shop.title}
      </h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            !activeCategory
              ? "border-[color:var(--accent)] bg-[color:var(--accent)]/15 text-[color:var(--accent-glow)]"
              : "border-hairline text-secondary hover:text-[color:var(--text-primary)]"
          }`}
        >
          {t.shop.all}
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              activeCategory === cat.slug
                ? "border-[color:var(--accent)] bg-[color:var(--accent)]/15 text-[color:var(--accent-glow)]"
                : "border-hairline text-secondary hover:text-[color:var(--text-primary)]"
            }`}
          >
            {locale === "bn" ? cat.name_bn : cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-secondary">{t.shop.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
