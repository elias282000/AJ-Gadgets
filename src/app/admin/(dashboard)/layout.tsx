import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already gates access to everything under /admin, but we
  // check again here server-side as defense in depth — this layout should
  // never render for an unauthenticated request even if middleware were
  // ever bypassed or misconfigured.
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyAdminSessionToken(token) : null;

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--bg)] sm:flex-row">
      {/* Mobile top bar — visible below the sm breakpoint only */}
      <header className="flex items-center justify-between border-b border-hairline p-3 sm:hidden">
        <Link href="/admin/products" className="flex items-center gap-2">
          <Image
            src="/logo-icon.png"
            alt="AJ Gadgets & Toy"
            width={24}
            height={24}
            className="rounded-md"
          />
          <span className="text-sm font-semibold text-[color:var(--text-primary)]">
            Admin
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">{session.username}</span>
        </div>
      </header>
      <div className="border-b border-hairline px-3 pb-3 sm:hidden">
        <AdminNav orientation="horizontal" />
      </div>

      {/* Desktop sidebar — hidden below the sm breakpoint */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-hairline p-4 sm:flex">
        <Link href="/admin/products" className="mb-6 flex items-center gap-2 px-1">
          <Image
            src="/logo-icon.png"
            alt="AJ Gadgets & Toy"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-sm font-semibold text-[color:var(--text-primary)]">
            Admin
          </span>
        </Link>

        <AdminNav />

        <div className="mt-auto space-y-1 border-t border-hairline pt-4">
          <p className="px-3 text-xs text-muted">Signed in as {session.username}</p>
          <LogoutButton />
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>

      {/* Mobile logout — placed at the bottom of the scroll so it doesn't
          compete with the compact top bar, but is still always reachable. */}
      <div className="border-t border-hairline p-3 sm:hidden">
        <LogoutButton />
      </div>
    </div>
  );
}
