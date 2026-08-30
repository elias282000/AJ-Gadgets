# Troubleshooting Plan: Admin Order Items Not Displaying

## Symptom
In the admin panel's Orders tab (`/admin/orders`), clicking an order row expands the detail view, but the ordered items list is empty or fails to render.

## Root Cause Analysis

### Primary Hypothesis: Supabase relationship key mismatch

**File**: `src/lib/admin.ts:55`
```ts
.select("*, order_items(*)")
```

**File**: `src/app/admin/(dashboard)/orders/OrdersTable.tsx:122`
```tsx
{order.items?.map((item) => (
```

**File**: `src/types/index.ts:35-48`
```ts
export interface Order {
  ...
  items?: OrderItem[];
}
```

**The Bug**: When Supabase JS client executes `.select("*, order_items(*)")`, the foreign-table relationship data is returned under the key `order_items` (matching the table name used in the select string), **not** `items`. At runtime, each order object looks like:

```json
{
  "id": "...",
  "customer_name": "...",
  "order_items": [
    { "product_name_snapshot": "...", "quantity": 2, ... }
  ]
}
```

But the frontend accesses `order.items`, which is `undefined`. The optional chaining `order.items?.map(...)` safely renders nothing — producing the exact symptom: order header shows, but items list is blank.

The TypeScript type assertion `(data ?? []) as unknown as Order[]` in `adminGetOrders` suppresses the compile-time error, so this ships as a silent runtime bug.

### Secondary Hypotheses (lower probability, verify after primary)

1. **Orphaned orders from failed checkout rollback**: If `order_items` insert fails in `checkout/route.ts:143-155` and the compensating `orders.delete()` also fails (network, permission), the database would contain an order with zero items. Check for orders where `order_items` count is 0 in Supabase Table Editor.

2. **Service role grants gap**: If `service_role` lacks `SELECT` on `order_items`, the `.select("*, order_items(*)")` returns `order_items: []` or omits it entirely. The schema SQL (`sql/schema.sql:121`) includes `grant all privileges on all tables in schema public to service_role`, so this is unlikely unless the SQL wasn't run or was run on a different project.

3. **Frontend rendering edge case**: If `order.items` exists but is an empty array `[]`, the map renders nothing. This would be correct behavior for an order with no items, but shouldn't happen given the checkout flow.

## Verification Steps

1. **Confirm the key mismatch**: In the browser DevTools Network tab, inspect the response from the admin page's data fetch (or add a temporary `console.log` in `OrdersTable.tsx` to print `order`). Check if the property is `order_items` instead of `items`.

2. **Check database directly**: In Supabase SQL Editor:
   ```sql
   SELECT o.id, o.customer_name, COUNT(oi.id) as item_count
   FROM orders o
   LEFT JOIN order_items oi ON oi.order_id = o.id
   GROUP BY o.id, o.customer_name
   ORDER BY o.created_at DESC;
   ```
   If `item_count` is 0 for orders that should have items, investigate checkout failures. If `item_count` > 0, the data exists and the issue is purely the frontend key mismatch.

3. **Check server logs**: Look for `adminGetOrders error:` in the Vercel/terminal logs. If the query errors, the function returns `[]` and the table shows "No orders yet" — a different symptom from what's described.

## Fix Plan

### Fix 1: Correct the Supabase select key (required)

**File**: `src/lib/admin.ts:55`

Change:
```ts
.select("*, order_items(*)")
```

To use the relationship name that matches the `Order` type:
```ts
.select("*, items:order_items(*)")
```

This tells Supabase: "select all columns from `orders`, plus the related `order_items` rows, and nest them under the key `items`." This aligns the runtime response with the `Order.items` TypeScript type and the `order.items` access in `OrdersTable.tsx`.

### Fix 2: Remove the unsafe double type assertion (recommended)

**File**: `src/lib/admin.ts:62`

Change:
```ts
return (data ?? []) as unknown as Order[];
```

To a proper typed return so future mismatches surface at compile time:
```ts
return (data ?? []) as Order[];
```

After Fix 1, TypeScript will recognize the shape matches `Order` (because `items` comes from the `items:order_items(*)` alias). If it still doesn't match, TypeScript will now flag the discrepancy instead of silently casting it away.

### Fix 3: Add a defensive fallback in the UI (defense in depth)

**File**: `src/app/admin/(dashboard)/orders/OrdersTable.tsx:122`

Update the items rendering to handle both key names during any transition period:
```tsx
{(order.items ?? (order as any).order_items ?? []).map((item) => (
```

This ensures items render even if there's a brief mismatch, and can be removed once the backend fix is confirmed deployed.

### Fix 4: Verify checkout rollback robustness (if orphaned orders found)

**File**: `src/app/api/checkout/route.ts:143-155`

The current rollback deletes the order if items insert fails, but doesn't verify the delete succeeded. Add error handling:
```ts
if (itemsError) {
  console.error("checkout: failed to insert order items:", itemsError.message);
  const { error: deleteError } = await admin.from("orders").delete().eq("id", order.id);
  if (deleteError) {
    console.error("checkout: failed to roll back order:", deleteError.message);
  }
  return NextResponse.json(
    { error: `Failed to save order items: ${itemsError.message}` },
    { status: 500 }
  );
}
```

## Validation Plan

1. Apply Fix 1 (`items:order_items(*)` alias).
2. Place a test order from the storefront.
3. Navigate to `/admin/orders` and click the new order row.
4. Confirm the items list renders with product name, quantity, and line total.
5. Check an existing order that previously showed no items — confirm it now displays correctly.
6. Verify TypeScript compiles without errors after Fix 2.
7. Run `npm run lint` and `npm run build` to confirm no regressions.

## Out of Scope

- Multi-image upload/reordering (mentioned in README as future work).
- Order search/filtering by status or customer name.
- Category management beyond the existing CRUD UI.
