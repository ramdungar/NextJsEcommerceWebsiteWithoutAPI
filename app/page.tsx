import { getAllCategories, getFeaturedProducts, getNewArrivals } from "@/lib/data";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { ProductGrid } from "@/components/product-grid";
import { CategoryCard } from "@/components/category-card";

export default async function HomePage() {
  const [featured, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(8),
    getAllCategories(),
  ]);

  return (
    <div className="flex flex-col gap-16 pb-16">
      <Hero />

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Shop by category" description="Find your next favorite thing, faster." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} category={category} priority={index < 3} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured products"
          description="Customer favorites, picked by our merchandising team."
          href="/products?sort=featured"
        />
        <ProductGrid products={featured} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="New arrivals"
          description="Fresh off the shelf and ready to ship."
          href="/products?sort=newest"
        />
        <ProductGrid products={newArrivals} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-2xl bg-neutral-900 px-6 py-10 text-center text-white sm:px-12 dark:bg-neutral-900">
          <h2 className="text-2xl font-semibold">Free shipping on orders over $75</h2>
          <p className="mx-auto max-w-md text-sm text-white/70">
            No codes, no minimums to remember — just automatic free shipping at checkout.
          </p>
        </div>
      </section>
    </div>
  );
}
