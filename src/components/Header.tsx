"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useCartStore } from "@/store/cart";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useLanguage();
  const totalQuantity = useCartStore((s) => s.totalQuantity());

  // The cart is persisted in localStorage, which the server can't read
  // during the initial render. Only show the badge after the component
  // has mounted on the client, so server and client markup match on the
  // very first paint (avoids a hydration mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-[color:var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-icon.png"
            alt="AJ Gadgets"
            width={34}
            height={34}
            className="rounded-md"
            priority
          />
          <span className="text-[15px] font-semibold tracking-tight text-[color:var(--text-primary)]">
            {t.siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-secondary sm:flex">
          <Link
            href="/"
            className="transition-colors hover:text-[color:var(--accent-glow)]"
          >
            {t.nav.home}
          </Link>
          <Link
            href="/shop"
            className="transition-colors hover:text-[color:var(--accent-glow)]"
          >
            {t.nav.shop}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/cart"
            className="relative text-sm text-secondary transition-colors hover:text-[color:var(--accent-glow)]"
          >
            {t.nav.cart}
            {mounted && totalQuantity > 0 && (
              <span
                className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium text-white"
                style={{ background: "var(--accent)" }}
              >
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
