export default function HomeLoading() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="h-6 w-56 animate-pulse rounded-full bg-elevated" />
        <div className="mt-6 h-12 w-3/4 animate-pulse rounded bg-elevated sm:h-16" />
        <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-elevated" />
        <div className="mt-10 h-12 w-36 animate-pulse rounded-full bg-elevated" />
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="h-4 w-40 animate-pulse rounded bg-elevated" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
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
      </section>
    </div>
  );
}
