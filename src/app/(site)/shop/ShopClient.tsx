"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageProvider";
import { ProductCard } from "@/components/ProductCard";
import { Category, Product } from "@/types";

export function ShopClient({
  categories,
  products,
  activeCategory,
  initialSearch,
  initialMinPrice,
  initialMaxPrice,
}: {
  categories: Category[];
  products: Product[];
  activeCategory: string | null;
  initialSearch: string;
  initialMinPrice: string;
  initialMaxPrice: string;
}) {
  const { locale, t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  // Keep local input state in sync if the URL changes from elsewhere
  // (e.g. clicking a category pill, browser back/forward).
  useEffect(() => setSearch(initialSearch), [initialSearch]);
  useEffect(() => setMinPrice(initialMinPrice), [initialMinPrice]);
  useEffect(() => setMaxPrice(initialMaxPrice), [initialMaxPrice]);

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  }

  // Debounce the free-text search so we're not firing a request on every
  // keystroke, but still update automatically without a submit button.
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleSearchChange(value: string) {
    setSearch(value);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      updateParams({ q: value });
    }, 400);
  }

  function handleApplyPriceRange() {
    updateParams({ min: minPrice, max: maxPrice });
  }

  const hasActiveFilters = !!(activeCategory || initialSearch || initialMinPrice || initialMaxPrice);

  function clearFilters() {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/shop");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {t.shop.title}
      </h1>

      {/* Search + price range */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t.shop.searchPlaceholder}
            className="w-full rounded-full border border-hairline bg-elevated px-4 py-2 text-sm outline-none focus:border-[color:var(--accent)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApplyPriceRange()}
            type="number"
            min="0"
            placeholder={t.shop.minPrice}
            className="w-24 rounded-full border border-hairline bg-elevated px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]"
          />
          <span className="text-secondary">–</span>
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApplyPriceRange()}
            type="number"
            min="0"
            placeholder={t.shop.maxPrice}
            className="w-24 rounded-full border border-hairline bg-elevated px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]"
          />
          <button
            onClick={handleApplyPriceRange}
            className="rounded-full border border-hairline px-4 py-2 text-sm text-secondary transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--text-primary)]"
          >
            {t.shop.apply}
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted hover:text-[color:var(--text-primary)] sm:ml-auto"
          >
            {t.shop.clearFilters}
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={(() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("category");
            return `/shop?${params.toString()}`;
          })()}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            !activeCategory
              ? "border-[color:var(--accent)] bg-[color:var(--accent)]/15 text-[color:var(--accent-glow)]"
              : "border-hairline text-secondary hover:text-[color:var(--text-primary)]"
          }`}
        >
          {t.shop.all}
        </Link>
        {categories.map((cat) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("category", cat.slug);
          return (
            <Link
              key={cat.id}
              href={`/shop?${params.toString()}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                activeCategory === cat.slug
                  ? "border-[color:var(--accent)] bg-[color:var(--accent)]/15 text-[color:var(--accent-glow)]"
                  : "border-hairline text-secondary hover:text-[color:var(--text-primary)]"
              }`}
            >
              {locale === "bn" ? cat.name_bn : cat.name}
            </Link>
          );
        })}
      </div>

      {/* Product grid */}
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
