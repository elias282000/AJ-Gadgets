import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { HeroText } from "@/components/HeroText";
import { FeaturedHeading, FeaturedEmptyMessage } from "@/components/FeaturedHeading";

export const revalidate = 0;

export default async function Home() {
  const featured = await getFeaturedProducts(4);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, var(--accent) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <HeroText />
        </div>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <FeaturedHeading />

          {featured.length === 0 ? (
            <FeaturedEmptyMessage />
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
