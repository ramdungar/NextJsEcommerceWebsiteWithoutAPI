"use client";

import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/components/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="flex h-40 items-center justify-center bg-slate-100 text-6xl"
      >
        <span aria-hidden>{product.emoji}</span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">
          {product.category}
        </span>
        <Link
          href={`/products/${product.id}`}
          className="font-semibold text-slate-900 hover:text-brand"
        >
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-500">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-slate-900">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
            data-testid={`add-${product.id}`}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
