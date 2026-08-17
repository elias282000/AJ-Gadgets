import { adminGetOrders } from "@/lib/admin";
import { OrdersTable } from "./OrdersTable";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await adminGetOrders();

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
        Orders
      </h1>
      <p className="mt-1 text-sm text-secondary">
        Click a row to see items and delivery address.
      </p>
      <OrdersTable orders={orders} />
    </div>
  );
}
