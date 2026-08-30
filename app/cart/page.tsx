"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/components/cart-context";

export default function CartPage() {
  const {
    detailedItems,
    totalItems,
    totalPrice,
    setQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const [placedOrder, setPlacedOrder] = useState(false);

  const shipping = totalPrice > 0 && totalPrice < 75 ? 5.99 : 0;
  const grandTotal = totalPrice + shipping;

  if (placedOrder) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Order confirmed!
        </h1>
        <p className="mt-2 text-slate-500">
          Thanks for shopping with NimbusShop. This is a demo, so no real
          payment was processed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-brand px-5 py-2.5 font-medium text-white transition hover:bg-brand-dark"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (detailedItems.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-5xl">🛒</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-slate-500">
          Add some products to get started.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-brand px-5 py-2.5 font-medium text-white transition hover:bg-brand-dark"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your cart</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-slate-500 hover:text-red-600"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ul className="flex flex-col gap-4 lg:col-span-2">
          {detailedItems.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              data-testid={`cart-item-${product.id}`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-3xl">
                <span aria-hidden>{product.emoji}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{product.name}</p>
                <p className="text-sm text-slate-500">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="flex items-center rounded-lg border border-slate-300">
                <button
                  type="button"
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                  onClick={() => setQuantity(product.id, quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  type="button"
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                  onClick={() => setQuantity(product.id, quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <div className="w-20 text-right font-semibold text-slate-900">
                {formatPrice(product.price * quantity)}
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(product.id)}
                className="text-slate-400 hover:text-red-600"
                aria-label={`Remove ${product.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Order summary
          </h2>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <dt>Items ({totalItems})</dt>
              <dd data-testid="summary-subtotal">{formatPrice(totalPrice)}</dd>
            </div>
            <div className="flex justify-between text-slate-600">
              <dt>Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
              <dt>Total</dt>
              <dd data-testid="summary-total">{formatPrice(grandTotal)}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => {
              clearCart();
              setPlacedOrder(true);
            }}
            className="mt-6 w-full rounded-lg bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark"
            data-testid="checkout"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
