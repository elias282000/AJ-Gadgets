"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { DeliveryZone } from "@/types";

const DHAKA_FEE_FALLBACK = 60;
const OUTSIDE_FEE_FALLBACK = 120;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState<DeliveryZone>("dhaka");
  const [fees, setFees] = useState({
    dhaka: DHAKA_FEE_FALLBACK,
    outsideDhaka: OUTSIDE_FEE_FALLBACK,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings/delivery-fees")
      .then((r) => r.json())
      .then((data) => {
        if (data?.dhaka && data?.outsideDhaka) setFees(data);
      })
      .catch(() => {
        /* fall back to defaults already set */
      });
  }, []);

  const deliveryFee = zone === "dhaka" ? fees.dhaka : fees.outsideDhaka;
  const total = subtotal + deliveryFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          phone,
          address,
          delivery_zone: zone,
          items: items.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      clear();
      router.push(`/order-confirmation/${data.orderId}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-4 text-secondary">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full px-6 py-3 text-sm font-medium text-white"
          style={{
            background:
              "linear-gradient(90deg, var(--accent), var(--accent-bright))",
          }}
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>

      <div className="mt-8 rounded-2xl border border-hairline bg-elevated p-5">
        {items.map((item) => (
          <div key={item.product_id} className="flex justify-between py-1.5 text-sm">
            <span className="text-secondary">
              {item.name} × {item.quantity}
            </span>
            <span>৳{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="mt-3 border-t border-hairline pt-3 text-sm">
          <div className="flex justify-between text-secondary">
            <span>Subtotal</span>
            <span>৳{subtotal.toLocaleString()}</span>
          </div>
          <div className="mt-1 flex justify-between text-secondary">
            <span>Delivery</span>
            <span>৳{deliveryFee.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-medium text-[color:var(--text-primary)]">
            <span>Total</span>
            <span>৳{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm text-secondary">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-hairline bg-elevated px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-secondary">Phone number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            className="w-full rounded-xl border border-hairline bg-elevated px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
            placeholder="01XXXXXXXXX"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-secondary">
            Delivery address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-hairline bg-elevated px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
            placeholder="House, road, area, city"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-secondary">
            Delivery area
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setZone("dhaka")}
              className={`flex-1 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                zone === "dhaka"
                  ? "border-[color:var(--accent)] bg-[color:var(--accent)]/15 text-[color:var(--accent-glow)]"
                  : "border-hairline text-secondary"
              }`}
            >
              Inside Dhaka (৳{fees.dhaka})
            </button>
            <button
              type="button"
              onClick={() => setZone("outside_dhaka")}
              className={`flex-1 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                zone === "outside_dhaka"
                  ? "border-[color:var(--accent)] bg-[color:var(--accent)]/15 text-[color:var(--accent-glow)]"
                  : "border-hairline text-secondary"
              }`}
            >
              Outside Dhaka (৳{fees.outsideDhaka})
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full py-3 text-sm font-medium text-white transition-transform disabled:opacity-50 enabled:hover:scale-[1.01]"
          style={{
            background:
              "linear-gradient(90deg, var(--accent), var(--accent-bright))",
          }}
        >
          {submitting ? "Placing order…" : "Place order — Cash on Delivery"}
        </button>
      </form>
    </div>
  );
}
