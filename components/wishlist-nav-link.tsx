"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { buttonVariants } from "@/components/ui/button";
import { useHydratedStore } from "@/lib/use-hydrated-store";

export function WishlistNavLink() {
  const hydrated = useHydratedStore(useWishlistStore);
  const count = useWishlistStore((state) => (hydrated ? state.slugs.length : 0));

  return (
    <Link
      href="/wishlist"
      aria-label={`Open wishlist, ${count} items`}
      className={buttonVariants({ variant: "ghost", size: "icon", className: "relative" })}
    >
      <Heart size={19} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
