-- AJ Gadgets — Database Schema
-- Run this in Supabase: Project -> SQL Editor -> New query -> paste -> Run

create extension if not exists "pgcrypto";

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_bn text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_bn text not null,
  description text default '',
  description_bn text default '',
  price numeric(10,2) not null,
  category_id uuid references categories(id) on delete set null,
  stock_status text not null default 'in_stock' check (stock_status in ('in_stock', 'out_of_stock')),
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Site settings (key/value) — used for delivery fees etc.
create table if not exists settings (
  key text primary key,
  value text not null
);

insert into settings (key, value) values
  ('delivery_fee_dhaka', '60'),
  ('delivery_fee_outside_dhaka', '120')
on conflict (key) do nothing;

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  delivery_zone text not null check (delivery_zone in ('dhaka', 'outside_dhaka')),
  delivery_fee numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric(10,2) not null,
  total_amount numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Order items (snapshot product info so edits/deletes don't corrupt history)
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name_snapshot text not null,
  price_snapshot numeric(10,2) not null,
  quantity integer not null check (quantity > 0)
);

-- Single admin user
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_orders_status on orders(status);

-- Row Level Security
-- Public (anon) can READ products, categories, settings.
-- Public can INSERT orders + order_items (checkout), but not read/update/delete them.
-- All admin writes (products, order status updates, settings) go through server-side
-- API routes using the service_role key, which bypasses RLS — so no public policies
-- are created for those write operations.

alter table categories enable row level security;
alter table products enable row level security;
alter table settings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table admin_users enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read settings" on settings for select using (true);

create policy "public can place orders" on orders for insert with check (true);
create policy "public can add order items" on order_items for insert with check (true);

-- No public policies on admin_users, and no public select/update/delete policies
-- on orders/order_items — the admin panel uses the service_role key server-side
-- for all of that, which bypasses RLS entirely.
