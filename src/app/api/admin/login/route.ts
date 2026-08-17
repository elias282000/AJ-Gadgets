import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/adminSession";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { username, password } = body;
  if (!username?.trim() || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();
  const { data: user, error } = await admin
    .from("admin_users")
    .select("*")
    .eq("username", username.trim())
    .single();

  // Deliberately vague error message — don't reveal whether the username
  // exists or the password was wrong.
  if (error || !user) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const token = await createAdminSessionToken({
    sub: user.id,
    username: user.username,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
