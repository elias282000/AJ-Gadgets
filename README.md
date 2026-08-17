# AJ Gadgets — Phase 1, 2 & 3

Phase 1: foundation, brand theme, database schema.
Phase 2: storefront — product listing, cart, checkout with COD + delivery fees.
Phase 3: admin panel — login, product management, orders dashboard, settings.

## What's new in Phase 3
- `/admin/login` — single-admin login (no public signup, by design)
- `/admin/products` — list, add, edit, delete products, with image upload
- `/admin/orders` — view all orders, update status (Pending/Shipped/Delivered/Cancelled),
  click a row to see items + delivery address
- `/admin/settings` — edit the Dhaka / Outside-Dhaka delivery fees shown at checkout
- All `/admin` pages and `/api/admin/*` routes are protected by middleware —
  logging out or never logging in redirects you straight to `/admin/login`

## Setup — do this in order

### 1. Install dependencies
```bash
npm install
```

### 2. Database & storage
If you haven't already, run `sql/schema.sql` in Supabase SQL Editor.

**New for Phase 3:** also run `sql/storage-setup.sql` — this creates the
`product-images` storage bucket (used for product photo uploads) and makes
sure the admin panel has permission to write to it.

### 3. Environment variables
Same `.env.local` as before — no new variables needed.

### 4. Create your admin login
This is a one-time setup step — there's no public signup form on purpose
(single-admin, per the original requirements). Run:
```bash
npm run create-admin -- your-username your-password
```
Use a real password (8+ characters). You can re-run this command any time
to reset your password — it updates the existing account instead of
failing.

### 5. Run locally
```bash
npm run dev
```
Go to `http://localhost:3000/admin/login` and sign in with what you just
created.

## Try this flow
1. Log in at `/admin/login`
2. `/admin/products` → "Add product" → fill in the form, upload a photo,
   save
3. Visit the storefront (`/shop`) in a new tab — your new product should
   appear immediately
4. Place a test order from the storefront like before
5. Back in `/admin/orders`, find that order and change its status — click
   the row to see the full address and item list

## Security notes
- Admin sessions are signed JWTs (`ADMIN_SESSION_SECRET`) stored in an
  `httpOnly` cookie — not readable by JavaScript, not vulnerable to XSS
  token theft.
- All admin API routes re-check the session server-side via middleware —
  someone can't just guess a `/api/admin/...` URL and use it without being
  logged in.
- Every admin data operation uses the Supabase **secret** key server-side,
  which bypasses Row Level Security — the admin panel is the only place
  in the app that can see/edit orders, all products (including
  out-of-stock), and settings.
- Passwords are hashed with bcrypt before being stored — the plain
  password is never saved anywhere.

## Known minor issue (non-blocking)
Next.js 16 shows a deprecation warning during build:
`The "middleware" file convention is deprecated. Please use "proxy" instead.`
The app still builds and works correctly — this is just Next.js signaling
a future rename of `src/middleware.ts` to `src/proxy.ts`. Safe to ignore
for now; worth revisiting next time this project is touched.

## What's left (optional, future work)
- Multi-image drag-to-reorder on products (currently: upload order = display order)
- Order search/filtering by status or customer name
- Category management UI (currently: edit categories directly in Supabase Table Editor)
