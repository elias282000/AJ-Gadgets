"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";

export function HeroText() {
  const { t } = useLanguage();

  return (
    <>
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-elevated px-3 py-1 text-xs text-secondary">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--accent-bright)" }}
        />
        {t.home.codBadge}
      </div>

      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
        <span className="text-[color:var(--text-primary)]">
          {t.home.heroStart}
        </span>
        <span className="accent-gradient-text">{t.home.heroAccent}</span>
        <span className="text-[color:var(--text-primary)]">
          {t.home.heroEnd}
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-lg text-secondary">
        {t.home.heroSubtitle}
      </p>

      <div className="mt-10 flex items-center gap-4">
        <Link
          href="/shop"
          className="rounded-full px-6 py-3 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(79,139,255,0.4)] transition-transform hover:scale-[1.03]"
          style={{
            background:
              "linear-gradient(90deg, var(--accent), var(--accent-bright))",
          }}
        >
          {t.home.shopNow}
        </Link>
      </div>
    </>
  );
}
