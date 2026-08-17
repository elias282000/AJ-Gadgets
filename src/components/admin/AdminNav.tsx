"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-[color:var(--accent)]/15 text-[color:var(--accent-glow)]"
                : "text-secondary hover:bg-elevated-2 hover:text-[color:var(--text-primary)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
