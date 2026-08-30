"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  color,
  sizeOption,
  quantity = 1,
  className,
  ...buttonProps
}: {
  product: Product;
  color?: string;
  sizeOption?: string;
  quantity?: number;
} & Omit<ButtonProps, "onClick">) {
  const addItem = useCartStore((state) => state.addItem);
  const outOfStock = product.stock <= 0;

  return (
    <Button
      type="button"
      variant="primary"
      disabled={outOfStock}
      className={cn("gap-2", className)}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addItem(product, { color, size: sizeOption, quantity });
        toast.success(`${product.name} added to cart`);
      }}
      {...buttonProps}
    >
      <ShoppingCart size={16} />
      {outOfStock ? "Sold out" : "Add to cart"}
    </Button>
  );
}
