import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/adminSession";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/api/admin/login"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const isAdminPath =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  if (!isAdminPath) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyAdminSessionToken(token) : null;

  if (!session) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
