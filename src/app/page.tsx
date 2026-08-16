"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Ambient glow, echoes the logo's lightning-through-shield mark */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, var(--accent) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-elevated px-3 py-1 text-xs text-secondary">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--accent-bright)" }}
            />
            Cash on delivery, across Bangladesh
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
            <span className="text-[color:var(--text-primary)]">Gear that </span>
            <span className="accent-gradient-text">keeps up</span>
            <span className="text-[color:var(--text-primary)]"> with you</span>
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
        </div>
      </section>

      {/* Featured */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
            {t.home.featured}
          </h2>
          <p className="mt-4 text-secondary">
            Product grid coming in Phase 2 — this page will list live products
            from the database.
          </p>
        </div>
      </section>
    </div>
  );
}
