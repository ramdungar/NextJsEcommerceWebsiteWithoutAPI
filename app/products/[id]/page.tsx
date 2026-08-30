import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getProduct, products } from "@/lib/products";
import { AddToCart } from "@/components/add-to-cart";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className="text-sm text-brand hover:underline">
        ← Back to products
      </Link>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 text-8xl">
          <span aria-hidden>{product.emoji}</span>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="text-amber-500">★</span>
            <span>{product.rating.toFixed(1)} rating</span>
          </div>
          <p className="text-slate-600">{product.description}</p>
          <span className="text-3xl font-bold text-slate-900">
            {formatPrice(product.price)}
          </span>
          <AddToCart productId={product.id} />
        </div>
      </div>
    </div>
  );
}
