"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

export function FeaturedHeading() {
  const { t } = useLanguage();
  return (
    <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
      {t.home.featured}
    </h2>
  );
}

export function FeaturedEmptyMessage() {
  const { t } = useLanguage();
  return <p className="mt-4 text-secondary">{t.home.noProducts}</p>;
}
