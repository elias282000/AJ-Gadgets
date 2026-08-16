export type Locale = "en" | "bn";

export const dictionary = {
  en: {
    siteName: "AJ Gadgets",
    tagline: "Wireless headphones, AirPods, smartwatches & accessories",
    nav: {
      home: "Home",
      shop: "Shop",
      cart: "Cart",
    },
    home: {
      heroTitle: "Gear that keeps up with you",
      heroSubtitle:
        "Handpicked headphones, earbuds, smartwatches, and accessories.",
      shopNow: "Shop now",
      featured: "Featured products",
    },
    footer: {
      contact: "Contact us",
      chatWhatsapp: "Chat on WhatsApp",
      rights: "All rights reserved.",
    },
  },
  bn: {
    siteName: "এজে গ্যাজেটস",
    tagline: "ওয়্যারলেস হেডফোন, এয়ারপডস, স্মার্টওয়াচ ও অ্যাকসেসরিজ",
    nav: {
      home: "হোম",
      shop: "শপ",
      cart: "কার্ট",
    },
    home: {
      heroTitle: "আপনার জন্য সেরা গ্যাজেট",
      heroSubtitle:
        "বাছাই করা হেডফোন, ইয়ারবাডস, স্মার্টওয়াচ ও অ্যাকসেসরিজ।",
      shopNow: "কেনাকাটা করুন",
      featured: "বিশেষ পণ্য",
    },
    footer: {
      contact: "যোগাযোগ করুন",
      chatWhatsapp: "হোয়াটসঅ্যাপে চ্যাট করুন",
      rights: "সর্বস্বত্ব সংরক্ষিত।",
    },
  },
} as const;
