import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { PriceTag } from "@/components/price-tag";
import { StarRating } from "@/components/star-rating";
import { WishlistButton } from "@/components/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && <Badge variant="accent">New</Badge>}
          {product.compareAtPrice && !outOfStock && <Badge variant="success">Sale</Badge>}
          {outOfStock && <Badge variant="outline" className="bg-white dark:bg-neutral-900">Sold out</Badge>}
        </div>
      </Link>
      <WishlistButton
        slug={product.slug}
        productName={product.name}
        className="absolute right-3 top-3"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {product.brand}
        </p>
        <Link href={`/products/${product.slug}`} className="line-clamp-2 font-medium text-neutral-900 hover:underline dark:text-white">
          {product.name}
        </Link>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} currency={product.currency} />
        </div>
        <AddToCartButton product={product} size="sm" className="w-full" />
      </div>
    </div>
  );
}
