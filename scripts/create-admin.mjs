// Creates (or resets the password for) the single admin account used to log
// into /admin. Run this once during setup, and again any time you want to
// change the password.
//
// Usage:
//   npm run create-admin -- <username> <password>
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY to be available
// in the environment — the npm script loads them from .env.local
// automatically via Node's --env-file flag.

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error("Usage: npm run create-admin -- <username> <password>");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Please choose a password with at least 8 characters.");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !secretKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY. Make sure .env.local is filled in."
  );
  process.exit(1);
}

const supabase = createClient(url, secretKey, { auth: { persistSession: false } });

const password_hash = await bcrypt.hash(password, 12);

const { error } = await supabase
  .from("admin_users")
  .upsert({ username, password_hash }, { onConflict: "username" });

if (error) {
  console.error("Failed to create/update admin user:", error.message);
  process.exit(1);
}

console.log(`Admin user "${username}" is ready. You can now log in at /admin/login.`);
