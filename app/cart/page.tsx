"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { selectCartTotals, useCartStore } from "@/store/cart-store";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";
import { useHydratedStore } from "@/lib/use-hydrated-store";

const FREE_SHIPPING_THRESHOLD = 75;
const STANDARD_SHIPPING = 6.99;

export default function CartPage() {
  const hydrated = useHydratedStore(useCartStore);
  const lines = useCartStore((state) => state.lines);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const { totalItems, subtotal } = selectCartTotals(lines);

  const shipping = lines.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;

  if (!hydrated) {
    return <div className="mx-auto max-w-5xl px-4 py-16" aria-hidden />;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Start exploring the catalog."
          action={
            <Link href="/products" className={buttonVariants({ size: "lg" })}>
              Continue shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-neutral-900 dark:text-white">
          <ShoppingBag size={22} /> Your cart
          <span className="text-base font-normal text-neutral-500 dark:text-neutral-400">
            ({totalItems} item{totalItems === 1 ? "" : "s"})
          </span>
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-medium text-neutral-500 hover:text-red-600 dark:text-neutral-400"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <ul className="flex flex-col gap-4 lg:col-span-2">
          {lines.map((line) => (
            <li
              key={`${line.slug}-${line.color ?? ""}-${line.size ?? ""}`}
              className="flex gap-4 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <Link
                href={`/products/${line.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
              >
                <Image src={line.image} alt={line.name} fill className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${line.slug}`}
                    className="font-medium text-neutral-900 hover:underline dark:text-white"
                  >
                    {line.name}
                  </Link>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                </div>
                {(line.color || line.size) && (
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                    {[line.color, line.size].filter(Boolean).join(" / ")}
                  </p>
                )}
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                  {formatPrice(line.price)} each
                </p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="flex h-8 w-8 items-center justify-center text-neutral-600 disabled:opacity-40 dark:text-neutral-300"
                      disabled={line.quantity <= 1}
                      onClick={() => updateQuantity(line.slug, line.quantity - 1, line.color, line.size)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-9 text-center text-sm">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="flex h-8 w-8 items-center justify-center text-neutral-600 disabled:opacity-40 dark:text-neutral-300"
                      disabled={line.quantity >= line.stock}
                      onClick={() => updateQuantity(line.slug, line.quantity + 1, line.color, line.size)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${line.name}`}
                    onClick={() => removeItem(line.slug, line.color, line.size)}
                    className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-red-600 dark:text-neutral-400"
                  >
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Order summary</h2>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500 dark:text-neutral-400">Subtotal</dt>
              <dd className="text-neutral-900 dark:text-white">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500 dark:text-neutral-400">Shipping</dt>
              <dd className="text-neutral-900 dark:text-white">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </dd>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
              </p>
            )}
          </dl>
          <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-900 dark:border-neutral-800 dark:text-white">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className={buttonVariants({ size: "lg", className: "mt-5 w-full" })}>
            Proceed to checkout
          </Link>
          <Link
            href="/products"
            className={buttonVariants({ variant: "outline", size: "lg", className: "mt-2 w-full" })}
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
