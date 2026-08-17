-- Sets up the Supabase Storage bucket used for product images.
-- Run this once in Supabase SQL Editor.

-- Create a public bucket so uploaded product images are viewable via a
-- plain URL on the storefront (no auth token needed to display them).
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Same lesson as the earlier table grants: RLS bypass and baseline
-- Postgres grants are separate layers. The admin panel uploads images
-- using the secret key (service_role), which needs explicit grants on
-- the storage schema in this project, same as it did for the public
-- schema tables.
grant usage on schema storage to service_role;
grant all privileges on storage.objects to service_role;
grant all privileges on storage.buckets to service_role;

-- Allow public (anon) read access to files in this bucket, so product
-- images actually load on the storefront for visitors who aren't logged
-- into anything.
drop policy if exists "public read product images" on storage.objects;
create policy "public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');
