"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AddToCartForm({ product }: { product: Product }) {
  const [color, setColor] = useState<string | undefined>(product.colors[0]);
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const outOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col gap-5">
      {product.colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-900 dark:text-white">
            Color: <span className="font-normal text-neutral-500 dark:text-neutral-400">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setColor(option)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  color === option
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                    : "border-neutral-200 text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-200"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-900 dark:text-white">
            Size: <span className="font-normal text-neutral-500 dark:text-neutral-400">{size}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSize(option)}
                className={cn(
                  "h-10 min-w-10 rounded-lg border px-3 text-sm transition-colors",
                  size === option
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                    : "border-neutral-200 text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-200"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-neutral-900 dark:text-white">Quantity</p>
        <div className="flex w-fit items-center rounded-lg border border-neutral-200 dark:border-neutral-700">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="flex h-10 w-10 items-center justify-center text-neutral-600 disabled:opacity-40 dark:text-neutral-300"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="flex h-10 w-10 items-center justify-center text-neutral-600 disabled:opacity-40 dark:text-neutral-300"
            disabled={quantity >= product.stock}
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          >
            <Plus size={14} />
          </button>
        </div>
        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          {outOfStock ? "Out of stock" : `${product.stock} in stock`}
        </p>
      </div>

      <Button
        type="button"
        size="lg"
        disabled={outOfStock}
        className="w-full gap-2 sm:w-fit"
        onClick={() => {
          addItem(product, { color, size, quantity });
          toast.success(`${product.name} added to cart`);
        }}
      >
        <ShoppingCart size={18} />
        {outOfStock ? "Sold out" : "Add to cart"}
      </Button>
    </div>
  );
}
