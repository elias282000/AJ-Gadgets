"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useLanguage();

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
            className="text-sm text-secondary transition-colors hover:text-[color:var(--accent-glow)]"
          >
            {t.nav.cart}
          </Link>
        </div>
      </div>
    </header>
  );
}
