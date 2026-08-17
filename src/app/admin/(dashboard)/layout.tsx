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
    <div className="flex min-h-screen bg-[color:var(--bg)]">
      <aside className="flex w-56 shrink-0 flex-col border-r border-hairline p-4">
        <Link href="/admin/products" className="mb-6 flex items-center gap-2 px-1">
          <Image
            src="/logo-icon.png"
            alt="AJ Gadgets"
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
    </div>
  );
}
