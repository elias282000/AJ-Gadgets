"use client";

import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-elevated">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo-icon.png"
            alt="AJ Gadgets & Toy"
            width={28}
            height={28}
            className="rounded-md"
          />
          <p className="font-medium text-[color:var(--text-primary)]">
            {t.siteName}
          </p>
        </div>
        <p className="mt-3 text-sm text-secondary">{t.tagline}</p>
        <p className="mt-6 text-xs text-muted">
          © {year} {t.siteName}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
