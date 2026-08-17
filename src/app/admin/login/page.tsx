"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed");
        setSubmitting(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg)] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/logo-icon.png"
            alt="AJ Gadgets & Toy"
            width={48}
            height={48}
            className="rounded-xl"
          />
          <h1 className="mt-4 text-lg font-semibold text-[color:var(--text-primary)]">
            Admin login
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-hairline bg-elevated p-6"
        >
          <div>
            <label className="mb-1.5 block text-sm text-secondary">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
              className="w-full rounded-xl border border-hairline bg-[color:var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm text-secondary">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-hairline bg-[color:var(--bg)] px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
            />
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full py-2.5 text-sm font-medium text-white transition-transform disabled:opacity-50 enabled:hover:scale-[1.01]"
            style={{
              background:
                "linear-gradient(90deg, var(--accent), var(--accent-bright))",
            }}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
