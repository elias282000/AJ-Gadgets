import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AJ Gadgets — Headphones, AirPods, Smartwatches & Accessories",
  description:
    "Shop wireless headphones, AirPods, smartwatches, and gadget accessories. Cash on delivery across Bangladesh.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
