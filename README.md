# AJ Gadgets — Phase 1 & 2

Phase 1: project foundation, brand theme, database schema.
Phase 2: product listing, product detail, cart, and checkout with COD +
Dhaka/Outside-Dhaka delivery fee logic.

## What's new in Phase 2
- `/shop` — product grid with category filter pills
- `/shop/[id]` — product detail page with Add to cart / Buy now
- `/cart` — cart page with quantity controls (persisted in the browser)
- `/checkout` — customer details form, delivery zone selector, live total
- `/order-confirmation/[id]` — confirmation page after placing an order
- `POST /api/checkout` — creates the order. Prices and delivery fees are
  always recalculated server-side from the database, never trusted from
  the browser, so nothing can be tampered with from the client.
- `GET /api/settings/delivery-fees` — used by the checkout page to show
  current fees
- Homepage now pulls real "Featured products" from the database
- Cart item count badge in the header

## Setup (same as Phase 1, plus one step)

### 1. Install dependencies
```bash
npm install
```

### 2. Database
If you haven't already, run `sql/schema.sql` in Supabase SQL Editor.

**New for Phase 2:** optionally run `sql/seed.sql` afterwards to add 5
sample categories and 3 sample products, so you have something to click
through immediately. Safe to delete this test data later from the database
directly (admin panel for deleting products comes in Phase 3).

### 3. Environment variables
Same `.env.local` as Phase 1 — no new variables needed for Phase 2.

### 4. Run locally
```bash
npm run dev
```
Visit http://localhost:3000 → click "Shop now" → pick a product → add to
cart → checkout with a test name/phone/address → you'll land on an order
confirmation page. Check your Supabase **Table Editor → orders** and
**order_items** to see the order that was just created.

## How the pricing/security works
- The cart only stores product id, name, and a *display* price — nothing
  from the cart is trusted at checkout time.
- `/api/checkout` looks up each product's real price and stock status
  directly from the database, and looks up the current delivery fee from
  the `settings` table, before creating the order. This means even if
  someone tampered with prices in their browser, the order is always
  charged correctly.
- Order confirmation and checkout both use the Supabase **service_role**
  key server-side only — this is intentional, since the `orders` table
  has no public read policy (customers shouldn't be able to browse each
  other's orders).

## Next: Phase 3
Admin panel — login, product management (add/edit/delete + image upload),
orders dashboard with status updates, and a settings page to edit delivery
fees without touching the database directly.
