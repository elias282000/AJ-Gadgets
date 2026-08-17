import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <Image
        src="/logo-icon.png"
        alt="AJ Gadgets"
        width={56}
        height={56}
        className="rounded-xl opacity-80"
      />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)]">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-full px-6 py-3 text-sm font-medium text-white"
          style={{
            background: "linear-gradient(90deg, var(--accent), var(--accent-bright))",
          }}
        >
          Go home
        </Link>
        <Link
          href="/shop"
          className="rounded-full border border-hairline px-6 py-3 text-sm text-secondary hover:text-[color:var(--text-primary)]"
        >
          Browse shop
        </Link>
      </div>
    </div>
  );
}
