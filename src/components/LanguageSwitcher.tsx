"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-hairline bg-elevated p-0.5 text-sm">
      <button
        onClick={() => setLocale("en")}
        className={`rounded-full px-3 py-1 transition-colors ${
          locale === "en"
            ? "bg-[color:var(--accent)] text-white"
            : "text-secondary"
        }`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("bn")}
        className={`rounded-full px-3 py-1 transition-colors ${
          locale === "bn"
            ? "bg-[color:var(--accent)] text-white"
            : "text-secondary"
        }`}
        aria-pressed={locale === "bn"}
      >
        বাং
      </button>
    </div>
  );
}
