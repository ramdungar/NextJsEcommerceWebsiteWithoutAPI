"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useWishlistStore } from "@/store/wishlist-store";
import { useHydratedStore } from "@/lib/use-hydrated-store";
import { ProductGrid } from "@/components/product-grid";
import { EmptyState } from "@/components/empty-state";
import { buttonVariants } from "@/components/ui/button";

export function WishlistView({ products }: { products: Product[] }) {
  const hydrated = useHydratedStore(useWishlistStore);
  const wishlistedSlugs = useWishlistStore((state) => state.slugs);

  if (!hydrated) {
    return <div className="py-16" aria-hidden />;
  }

  const items = products.filter((product) => wishlistedSlugs.includes(product.slug));

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart icon on any product to save it here for later."
        action={
          <Link href="/products" className={buttonVariants({ size: "lg" })}>
            Browse products
          </Link>
        }
      />
    );
  }

  return <ProductGrid products={items} />;
}
