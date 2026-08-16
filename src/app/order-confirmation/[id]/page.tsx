import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";

export const revalidate = 0;

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = getSupabaseAdmin();

  const { data: order } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: "var(--accent)" }}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        Order placed!
      </h1>
      <p className="mt-2 text-secondary">
        Thanks, {order.customer_name}. We&apos;ll call you at {order.phone} to
        confirm delivery.
      </p>

      <div className="mt-8 rounded-2xl border border-hairline bg-elevated p-5 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Order reference</span>
          <span className="font-mono text-xs">{order.id.slice(0, 8)}</span>
        </div>
        <div className="mt-3 border-t border-hairline pt-3">
          {order.order_items.map(
            (item: {
              id: string;
              product_name_snapshot: string;
              quantity: number;
              price_snapshot: number;
            }) => (
              <div key={item.id} className="flex justify-between py-1 text-sm">
                <span className="text-secondary">
                  {item.product_name_snapshot} × {item.quantity}
                </span>
                <span>
                  ৳{(item.price_snapshot * item.quantity).toLocaleString()}
                </span>
              </div>
            )
          )}
        </div>
        <div className="mt-3 flex justify-between border-t border-hairline pt-3 text-base font-medium">
          <span>Total (Cash on Delivery)</span>
          <span>৳{order.total_amount.toLocaleString()}</span>
        </div>
      </div>

      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full px-6 py-3 text-sm font-medium text-white"
        style={{
          background: "linear-gradient(90deg, var(--accent), var(--accent-bright))",
        }}
      >
        Continue shopping
      </Link>
    </div>
  );
}
