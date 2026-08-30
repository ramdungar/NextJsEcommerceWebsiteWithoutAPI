"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlist-store";
import { useHydratedStore } from "@/lib/use-hydrated-store";
import { cn } from "@/lib/utils";

export function WishlistButton({
  slug,
  productName,
  className,
}: {
  slug: string;
  productName: string;
  className?: string;
}) {
  const hydrated = useHydratedStore(useWishlistStore);
  const isWishlisted = useWishlistStore((state) => hydrated && state.slugs.includes(slug));
  const toggle = useWishlistStore((state) => state.toggle);

  return (
    <button
      type="button"
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(slug);
        toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist");
      }}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-600 shadow-sm backdrop-blur transition-colors hover:text-rose-600 dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-300",
        isWishlisted && "text-rose-600",
        className
      )}
    >
      <Heart size={17} className={cn(isWishlisted && "fill-rose-600")} />
    </button>
  );
}
