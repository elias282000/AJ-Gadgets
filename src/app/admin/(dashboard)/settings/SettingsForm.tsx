"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SettingsForm({
  deliveryFeeDhaka,
  deliveryFeeOutsideDhaka,
}: {
  deliveryFeeDhaka: number;
  deliveryFeeOutsideDhaka: number;
}) {
  const router = useRouter();
  const [dhaka, setDhaka] = useState(deliveryFeeDhaka.toString());
  const [outside, setOutside] = useState(deliveryFeeOutsideDhaka.toString());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const dhakaNum = Number(dhaka);
    const outsideNum = Number(outside);

    if (Number.isNaN(dhakaNum) || dhakaNum < 0 || Number.isNaN(outsideNum) || outsideNum < 0) {
      setError("Please enter valid non-negative numbers for both fees.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryFeeDhaka: dhakaNum,
          deliveryFeeOutsideDhaka: outsideNum,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to save settings");
        setSubmitting(false);
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <div>
        <label className="mb-1.5 block text-sm text-secondary">
          Delivery fee — Inside Dhaka (৳)
        </label>
        <input
          value={dhaka}
          onChange={(e) => setDhaka(e.target.value)}
          type="number"
          min="0"
          step="1"
          className="w-full rounded-xl border border-hairline bg-elevated px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-secondary">
          Delivery fee — Outside Dhaka (৳)
        </label>
        <input
          value={outside}
          onChange={(e) => setOutside(e.target.value)}
          type="number"
          min="0"
          step="1"
          className="w-full rounded-xl border border-hairline bg-elevated px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-[color:var(--accent-glow)]">Saved.</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full px-6 py-2.5 text-sm font-medium text-white transition-transform disabled:opacity-50 enabled:hover:scale-[1.02]"
        style={{
          background: "linear-gradient(90deg, var(--accent), var(--accent-bright))",
        }}
      >
        {submitting ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
