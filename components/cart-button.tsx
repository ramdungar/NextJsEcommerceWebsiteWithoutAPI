"use client";

import { ShoppingBag } from "lucide-react";
import { selectCartTotals, useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { useHydratedStore } from "@/lib/use-hydrated-store";

export function CartButton() {
  const hydrated = useHydratedStore(useCartStore);
  const lines = useCartStore((state) => state.lines);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { totalItems } = selectCartTotals(hydrated ? lines : []);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`Open cart, ${totalItems} items`}
      onClick={toggleCart}
      className="relative"
    >
      <ShoppingBag size={19} />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-semibold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Button>
  );
}
