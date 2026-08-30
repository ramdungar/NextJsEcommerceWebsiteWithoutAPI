import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl bg-gradient-to-r from-brand to-indigo-400 px-6 py-10 text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Gear that keeps you moving.
        </h1>
        <p className="mt-2 max-w-xl text-indigo-100">
          Browse our curated catalog of everyday tech and lifestyle products.
          Everything runs locally — no external API needed.
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">All products</h2>
          <span className="text-sm text-slate-500">
            {products.length} items
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
