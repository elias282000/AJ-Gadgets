"use client";

import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Order, OrderStatus } from "@/types";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-elevated-2 text-muted",
  shipped: "bg-[color:var(--accent)]/15 text-[color:var(--accent-glow)]",
  delivered: "bg-green-500/15 text-green-400",
  cancelled: "bg-red-500/15 text-red-400",
};

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update order status");
        setUpdatingId(null);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (orders.length === 0) {
    return <p className="mt-10 text-secondary">No orders yet.</p>;
  }

  return (
    <div className="mt-6">
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-hairline bg-elevated text-left text-secondary">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Area</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <Fragment key={order.id}>
                <tr
                  key={order.id}
                  onClick={() =>
                    setExpandedId(expandedId === order.id ? null : order.id)
                  }
                  className="cursor-pointer border-b border-hairline last:border-0 hover:bg-elevated"
                >
                  <td className="px-4 py-3 font-mono text-xs text-secondary">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[color:var(--text-primary)]">
                      {order.customer_name}
                    </div>
                    <div className="text-xs text-muted">{order.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    {order.delivery_zone === "dhaka" ? "Dhaka" : "Outside Dhaka"}
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    ৳{order.total_amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      disabled={updatingId === order.id}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs outline-none disabled:opacity-50 ${STATUS_STYLES[order.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[color:var(--bg)] text-[color:var(--text-primary)]">
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(order.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
                {expandedId === order.id && (
                  <tr key={`${order.id}-detail`} className="border-b border-hairline bg-elevated">
                    <td colSpan={6} className="px-4 py-4">
                      <p className="text-xs text-muted">Delivery address</p>
                      <p className="mt-1 text-secondary">{order.address}</p>
                      <p className="mt-3 text-xs text-muted">Items</p>
                      <div className="mt-1 space-y-1">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex justify-between text-secondary">
                            <span>
                              {item.product_name_snapshot} × {item.quantity}
                            </span>
                            <span>
                              ৳{(item.price_snapshot * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex justify-between border-t border-hairline pt-2 text-xs text-muted">
                        <span>Subtotal + Delivery (৳{order.delivery_fee})</span>
                        <span>৳{order.total_amount.toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
