-- Optional: sample data so you can see the storefront working immediately.
-- Run this AFTER schema.sql. Safe to skip if you'd rather add real products
-- from the admin panel once Phase 3 is built — just delete these later.

insert into categories (name, name_bn, slug) values
  ('Headphones', 'হেডফোন', 'headphones'),
  ('Earbuds & AirPods', 'ইয়ারবাডস ও এয়ারপডস', 'earbuds'),
  ('Smartwatches', 'স্মার্টওয়াচ', 'smartwatches'),
  ('Chargers & Cables', 'চার্জার ও ক্যাবল', 'chargers-cables'),
  ('Accessories', 'অ্যাকসেসরিজ', 'accessories')
on conflict (slug) do nothing;

insert into products (name, name_bn, description, description_bn, price, category_id, stock_status, image_urls)
select
  'Wireless Over-Ear Headphones',
  'ওয়্যারলেস ওভার-ইয়ার হেডফোন',
  'Comfortable over-ear wireless headphones with up to 20 hours of battery life.',
  'আরামদায়ক ওভার-ইয়ার ওয়্যারলেস হেডফোন, ২০ ঘণ্টা পর্যন্ত ব্যাটারি ব্যাকআপ।',
  1490,
  id,
  'in_stock',
  '{}'
from categories where slug = 'headphones';

insert into products (name, name_bn, description, description_bn, price, category_id, stock_status, image_urls)
select
  'TWS Earbuds Pro',
  'টিডব্লিউএস ইয়ারবাডস প্রো',
  'True wireless earbuds with noise isolation and touch controls.',
  'নয়েজ আইসোলেশন ও টাচ কন্ট্রোলসহ ট্রু ওয়্যারলেস ইয়ারবাডস।',
  1290,
  id,
  'in_stock',
  '{}'
from categories where slug = 'earbuds';

insert into products (name, name_bn, description, description_bn, price, category_id, stock_status, image_urls)
select
  'Smart Watch Series X',
  'স্মার্ট ওয়াচ সিরিজ এক্স',
  'Fitness tracking smartwatch with heart rate monitor and call notifications.',
  'হার্ট রেট মনিটর ও কল নোটিফিকেশনসহ ফিটনেস ট্র্যাকিং স্মার্টওয়াচ।',
  2190,
  id,
  'in_stock',
  '{}'
from categories where slug = 'smartwatches';
