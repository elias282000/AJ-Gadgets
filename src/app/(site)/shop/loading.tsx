export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="h-8 w-24 animate-pulse rounded-lg bg-elevated" />

      <div className="mt-6 flex gap-3">
        <div className="h-9 w-48 animate-pulse rounded-full bg-elevated" />
        <div className="h-9 w-40 animate-pulse rounded-full bg-elevated" />
      </div>

      <div className="mt-4 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-elevated" />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-hairline">
            <div className="aspect-square animate-pulse bg-elevated" />
            <div className="p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-elevated" />
              <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-elevated" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
