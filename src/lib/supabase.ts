import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Public client — safe to use in client components and in server code
 * that only ever needs to READ public data (products, categories, settings)
 * or INSERT an order during checkout. Respects Row Level Security.
 */
export const supabase = createClient(supabaseUrl, anonKey);

/**
 * Admin client — SERVER-SIDE ONLY. Never import this into a client component
 * or anything that ships to the browser. Uses the service_role key, which
 * bypasses Row Level Security entirely. Used by admin API routes to manage
 * products, view/update orders, and edit settings.
 */
export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (server-side only)."
    );
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
