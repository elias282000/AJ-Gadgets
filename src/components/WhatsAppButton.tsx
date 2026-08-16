"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

export function WhatsAppButton() {
  const { t } = useLanguage();
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (!number) return null;

  const href = `https://wa.me/${number}?text=${encodeURIComponent(
    "Hi! I have a question about a product on AJ Gadgets."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.footer.chatWhatsapp}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.34.648 4.53 1.77 6.4L4 29l7.79-1.75A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.63 28 15S22.63 3 16.004 3Zm0 21.6c-1.95 0-3.77-.55-5.31-1.5l-.38-.23-4.62 1.04 1.06-4.5-.25-.4A9.55 9.55 0 0 1 5.4 15c0-5.85 4.76-10.6 10.6-10.6S26.6 9.15 26.6 15 21.85 24.6 16.004 24.6Zm5.55-7.9c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.08-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.65-.94-2.25-.25-.6-.5-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
      </svg>
    </a>
  );
}
