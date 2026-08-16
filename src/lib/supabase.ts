import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Supabase's current key naming is "publishable" (client-safe) and "secret"
// (server-only), replacing the older "anon" / "service_role" terminology.
// We accept either name so this works regardless of which your dashboard
// shows you, but NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is the one to use
// going forward.
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Public client — safe to use in client components and in server code
 * that only ever needs to READ public data (products, categories, settings)
 * or INSERT an order during checkout. Respects Row Level Security.
 */
export const supabase = createClient(supabaseUrl, publishableKey);

/**
 * Admin client — SERVER-SIDE ONLY. Never import this into a client component
 * or anything that ships to the browser. Uses the secret key, which bypasses
 * Row Level Security entirely. Used by admin API routes to manage products,
 * view/update orders, and edit settings.
 */
export function getSupabaseAdmin() {
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not set. Add it to .env.local (server-side only)."
    );
  }
  return createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false },
  });
}
