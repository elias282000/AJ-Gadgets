-- Fix: "permission denied for table products" even when using the SECRET
-- key (server-side admin client).
--
-- The secret/service_role key bypasses Row Level Security, but it still
-- needs a baseline Postgres GRANT to touch each table — RLS bypass and
-- table-level grants are two separate permission layers. This was missing
-- for service_role, same as it was for anon/authenticated. Run this once
-- in Supabase SQL Editor. Safe to re-run.

grant usage on schema public to service_role;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
