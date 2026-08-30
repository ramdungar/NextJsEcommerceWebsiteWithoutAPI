"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { selectCartTotals, useCartStore } from "@/store/cart-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";
import { useHydratedStore } from "@/lib/use-hydrated-store";

export function CartDrawer() {
  const hydrated = useHydratedStore(useCartStore);
  const isOpen = useCartStore((state) => state.isOpen);
  const rawLines = useCartStore((state) => state.lines);
  const lines = hydrated ? rawLines : [];
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const { totalItems, subtotal } = selectCartTotals(lines);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-black/40"
        onClick={closeCart}
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
            <ShoppingBag size={20} /> Your cart ({totalItems})
          </h2>
          <Button variant="ghost" size="icon" aria-label="Close cart" onClick={closeCart}>
            <X size={18} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {lines.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Browse the shop and add something you love."
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map((line) => (
                <li key={`${line.slug}-${line.color ?? ""}-${line.size ?? ""}`} className="flex gap-3">
                  <Link
                    href={`/products/${line.slug}`}
                    onClick={closeCart}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800"
                  >
                    <Image src={line.image} alt={line.name} fill className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${line.slug}`}
                        onClick={closeCart}
                        className="line-clamp-2 text-sm font-medium text-neutral-900 hover:underline dark:text-white"
                      >
                        {line.name}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Remove ${line.name} from cart`}
                        className="text-neutral-400 hover:text-red-500"
                        onClick={() => removeItem(line.slug, line.color, line.size)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {(line.color || line.size) && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {[line.color, line.size].filter(Boolean).join(" / ")}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-neutral-200 dark:border-neutral-700">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center text-neutral-600 disabled:opacity-40 dark:text-neutral-300"
                          disabled={line.quantity <= 1}
                          onClick={() => updateQuantity(line.slug, line.quantity - 1, line.color, line.size)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center text-neutral-600 disabled:opacity-40 dark:text-neutral-300"
                          disabled={line.quantity >= line.stock}
                          onClick={() => updateQuantity(line.slug, line.quantity + 1, line.color, line.size)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {formatPrice(line.price * line.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">Subtotal</span>
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className={buttonVariants({ size: "lg", className: "w-full" })}
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}
              >
                View cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
