export type Locale = "en" | "bn";

export const dictionary = {
  en: {
    siteName: "AJ Gadgets & Toy",
    tagline: "Wireless headphones, AirPods, smartwatches & accessories",
    nav: {
      home: "Home",
      shop: "Shop",
      cart: "Cart",
    },
    home: {
      heroStart: "Gear that ",
      heroAccent: "keeps up",
      heroEnd: " with you",
      heroSubtitle:
        "Handpicked headphones, earbuds, smartwatches, and accessories.",
      codBadge: "Cash on delivery, across Bangladesh",
      shopNow: "Shop now",
      featured: "Featured products",
      noProducts:
        "No products yet — add some from the admin panel once Phase 3 is ready.",
    },
    shop: {
      title: "Shop",
      all: "All",
      empty: "No products found matching your filters.",
      searchPlaceholder: "Search products…",
      minPrice: "Min ৳",
      maxPrice: "Max ৳",
      apply: "Apply",
      clearFilters: "Clear filters",
    },
    footer: {
      contact: "Contact us",
      chatWhatsapp: "Chat on WhatsApp",
      rights: "All rights reserved.",
    },
  },
  bn: {
    siteName: "এজে গ্যাজেটস অ্যান্ড টয়",
    tagline: "ওয়্যারলেস হেডফোন, এয়ারপডস, স্মার্টওয়াচ ও অ্যাকসেসরিজ",
    nav: {
      home: "হোম",
      shop: "শপ",
      cart: "কার্ট",
    },
    home: {
      heroStart: "আপনার জন্য ",
      heroAccent: "সেরা",
      heroEnd: " গ্যাজেট",
      heroSubtitle:
        "বাছাই করা হেডফোন, ইয়ারবাডস, স্মার্টওয়াচ ও অ্যাকসেসরিজ।",
      codBadge: "সারা বাংলাদেশে ক্যাশ অন ডেলিভারি",
      shopNow: "কেনাকাটা করুন",
      featured: "বিশেষ পণ্য",
      noProducts: "এখনো কোনো পণ্য যোগ করা হয়নি।",
    },
    shop: {
      title: "শপ",
      all: "সব",
      empty: "আপনার ফিল্টার অনুযায়ী কোনো পণ্য পাওয়া যায়নি।",
      searchPlaceholder: "পণ্য খুঁজুন…",
      minPrice: "সর্বনিম্ন ৳",
      maxPrice: "সর্বোচ্চ ৳",
      apply: "প্রয়োগ করুন",
      clearFilters: "ফিল্টার মুছুন",
    },
    footer: {
      contact: "যোগাযোগ করুন",
      chatWhatsapp: "হোয়াটসঅ্যাপে চ্যাট করুন",
      rights: "সর্বস্বত্ব সংরক্ষিত।",
    },
  },
} as const;
