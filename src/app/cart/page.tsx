"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const { locale, t } = useLanguage();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t.nav.cart}</h1>
        <p className="mt-4 text-secondary">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full px-6 py-3 text-sm font-medium text-white"
          style={{
            background:
              "linear-gradient(90deg, var(--accent), var(--accent-bright))",
          }}
        >
          {t.home.shopNow}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">{t.nav.cart}</h1>

      <div className="mt-8 divide-y divide-[color:var(--border)] border-y border-hairline">
        {items.map((item) => {
          const name = locale === "bn" ? item.name_bn || item.name : item.name;
          return (
            <div key={item.product_id} className="flex items-center gap-4 py-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-hairline bg-elevated">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">{name}</p>
                <p className="mt-1 text-sm text-secondary">
                  ৳{item.price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(item.product_id, item.quantity - 1)}
                  className="h-8 w-8 rounded-full border border-hairline text-sm text-secondary hover:text-[color:var(--text-primary)]"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => setQuantity(item.product_id, item.quantity + 1)}
                  className="h-8 w-8 rounded-full border border-hairline text-sm text-secondary hover:text-[color:var(--text-primary)]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.product_id)}
                className="ml-2 text-xs text-muted hover:text-[color:var(--text-primary)]"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-secondary">Subtotal</span>
        <span className="text-lg font-medium">৳{subtotal.toLocaleString()}</span>
      </div>
      <p className="mt-1 text-xs text-muted">
        Delivery fee calculated at checkout based on your area.
      </p>

      <Link
        href="/checkout"
        className="mt-8 block w-full rounded-full py-3 text-center text-sm font-medium text-white transition-transform hover:scale-[1.01]"
        style={{
          background:
            "linear-gradient(90deg, var(--accent), var(--accent-bright))",
        }}
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
