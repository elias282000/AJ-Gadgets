export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl border border-hairline bg-elevated" />
        <div>
          <div className="h-8 w-2/3 animate-pulse rounded bg-elevated" />
          <div className="mt-4 h-6 w-24 animate-pulse rounded bg-elevated" />
          <div className="mt-8 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-elevated" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-elevated" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-elevated" />
          </div>
          <div className="mt-8 flex gap-3">
            <div className="h-11 w-32 animate-pulse rounded-full bg-elevated" />
            <div className="h-11 w-28 animate-pulse rounded-full bg-elevated" />
          </div>
        </div>
      </div>
    </div>
  );
}
