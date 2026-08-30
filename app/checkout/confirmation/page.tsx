"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { CheckCircle2, Package } from "lucide-react";
import type { OrderResult } from "@/lib/actions";
import { formatPrice } from "@/lib/format";
import { formatDate } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";

const ORDER_STORAGE_KEY = "storefront-last-order";
const noopSubscribe = () => () => {};

export default function OrderConfirmationPage() {
  // sessionStorage never changes for the lifetime of this page, so we read
  // it via useSyncExternalStore (server snapshot = null) instead of an
  // effect + setState, avoiding a hydration-driven cascading render.
  const raw = useSyncExternalStore(
    noopSubscribe,
    () => sessionStorage.getItem(ORDER_STORAGE_KEY),
    () => null
  );
  const order = useMemo<OrderResult | null>(() => (raw ? JSON.parse(raw) : null), [raw]);

  if (order === null) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">No recent order found</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Place an order to see your confirmation here.
        </p>
        <Link href="/products" className={buttonVariants({ size: "lg" })}>
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 size={48} className="text-emerald-500" />
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Order confirmed</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Thanks, {order.customer.name.split(" ")[0] || order.customer.name}! We&rsquo;ve emailed a
          receipt to {order.customer.email}.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">Order number</span>
          <span className="font-mono font-semibold text-neutral-900 dark:text-white">{order.orderId}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">Placed on</span>
          <span className="text-neutral-900 dark:text-white">{formatDate(order.placedAt)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <Package size={14} /> Estimated delivery
          </span>
          <span className="text-neutral-900 dark:text-white">{formatDate(order.estimatedDelivery)}</span>
        </div>

        <ul className="mt-5 flex flex-col gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          {order.items.map((item) => (
            <li key={`${item.slug}-${item.color ?? ""}-${item.size ?? ""}`} className="flex justify-between text-sm">
              <span className="text-neutral-700 dark:text-neutral-200">
                {item.name} × {item.quantity}
                {(item.color || item.size) && (
                  <span className="text-neutral-400"> ({[item.color, item.size].filter(Boolean).join(" / ")})</span>
                )}
              </span>
              <span className="text-neutral-900 dark:text-white">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 flex flex-col gap-2 border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800">
          <div className="flex justify-between">
            <dt className="text-neutral-500 dark:text-neutral-400">Subtotal</dt>
            <dd className="text-neutral-900 dark:text-white">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500 dark:text-neutral-400">Shipping</dt>
            <dd className="text-neutral-900 dark:text-white">
              {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-semibold text-neutral-900 dark:border-neutral-800 dark:text-white">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex justify-center">
        <Link href="/products" className={buttonVariants({ size: "lg" })}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
