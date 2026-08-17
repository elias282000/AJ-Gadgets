import { LanguageProvider } from "@/i18n/LanguageProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </LanguageProvider>
  );
}
