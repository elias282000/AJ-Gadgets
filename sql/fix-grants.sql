-- Fix: "permission denied for table products" (and similar)
--
-- Row Level Security policies only control WHICH ROWS a role can see —
-- the role still needs a baseline Postgres GRANT to touch the table at
-- all. This was missing from the original schema.sql. Run this once in
-- Supabase SQL Editor to fix it (safe to re-run, and safe on top of an
-- already-working project).

grant usage on schema public to anon, authenticated;

grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.settings to anon, authenticated;

grant insert on public.orders to anon, authenticated;
grant insert on public.order_items to anon, authenticated;

-- Note: admin_users has no grants here on purpose — only the server-side
-- secret-key client touches it, which bypasses grants and RLS entirely.
