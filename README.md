# AJ Gadgets — Phase 1 (Foundation)

This is the foundation of the AJ Gadgets e-commerce site: Next.js + Tailwind
project scaffold, Supabase database schema, base layout (header, footer,
language switcher, WhatsApp button), and Bengali/English translations.

## What's included in Phase 1
- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Supabase client setup (`src/lib/supabase.ts`) — public client + admin client
- Database schema (`sql/schema.sql`) — products, categories, orders,
  order_items, settings, admin_users, with Row Level Security policies
- Base layout: header with nav + language switcher, footer, floating
  WhatsApp button
- Bengali/English language switching (`src/i18n/`)
- Placeholder homepage (real product grid comes in Phase 2)

## Setup instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Set up the database
1. Go to your Supabase project → **SQL Editor** → **New query**
2. Paste the entire contents of `sql/schema.sql`
3. Click **Run**

This creates all tables, sets default delivery fees (৳60 Dhaka / ৳120
outside Dhaka — editable later from the admin Settings page), and sets up
Row Level Security so the public can only read products/categories/settings
and submit orders, never read or edit other people's orders.

### 3. Configure environment variables
1. Copy `.env.local.example` to `.env.local`
2. Fill in values from Supabase → **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (keep secret — server-side only)
3. Generate a session secret for admin login:
   ```bash
   openssl rand -base64 32
   ```
   Paste it as `ADMIN_SESSION_SECRET`
4. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to your WhatsApp number in international
   format, digits only (e.g. `8801XXXXXXXXX`)

### 4. Run locally
```bash
npm run dev
```
Visit http://localhost:3000 — you should see the homepage with the language
switcher and floating WhatsApp button working.

## Project structure
```
src/
  app/            Pages (App Router)
  components/     Header, Footer, WhatsAppButton, LanguageSwitcher
  i18n/           Bengali/English dictionary + LanguageProvider
  lib/            Supabase clients
  types/          Shared TypeScript types
sql/
  schema.sql      Full database schema — run once in Supabase SQL Editor
```

## Next: Phase 2
Product listing, product detail pages, cart, and checkout with the
Dhaka/Outside-Dhaka delivery fee logic.
