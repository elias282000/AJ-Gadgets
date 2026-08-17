import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin", // admin panel — already auth-gated, but no reason to let crawlers hit it
          "/api", // API routes — nothing here is a page worth indexing
          "/cart", // personal, no unique content to index
          "/checkout", // personal, no unique content to index
          "/order-confirmation", // contains customer name/phone — must never be indexed
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
