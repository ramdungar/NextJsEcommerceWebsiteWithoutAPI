"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { selectCartTotals, useCartStore } from "@/store/cart-store";
import { useHydratedStore } from "@/lib/use-hydrated-store";
import { placeOrderAction, type CustomerInput } from "@/lib/actions";
import { formatPrice } from "@/lib/format";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

const FREE_SHIPPING_THRESHOLD = 75;
const STANDARD_SHIPPING = 6.99;

const initialCustomer: CustomerInput = {
  name: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  country: "United States",
};

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydratedStore(useCartStore);
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clearCart);
  const { subtotal } = selectCartTotals(lines);
  const shipping = lines.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;

  const [customer, setCustomer] = useState<CustomerInput>(initialCustomer);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!hydrated) {
    return <div className="mx-auto max-w-5xl px-4 py-16" aria-hidden />;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="Nothing to check out"
          description="Add a few products to your cart before heading to checkout."
          action={
            <Link href="/products" className={buttonVariants({ size: "lg" })}>
              Browse products
            </Link>
          }
        />
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await placeOrderAction(
        lines.map((line) => ({
          slug: line.slug,
          quantity: line.quantity,
          color: line.color,
          size: line.size,
        })),
        customer
      );

      if ("error" in result) {
        setError(result.error);
        return;
      }

      sessionStorage.setItem("storefront-last-order", JSON.stringify(result));
      clearCart();
      router.push("/checkout/confirmation");
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-semibold text-neutral-900 dark:text-white">Checkout</h1>

      <div className="grid gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 lg:col-span-2">
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-1 text-lg font-semibold text-neutral-900 dark:text-white">
              Shipping details
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                  className={inputClass}
                  autoComplete="name"
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  required
                  value={customer.email}
                  onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
                  className={inputClass}
                  autoComplete="email"
                />
              </Field>
            </div>
            <Field label="Street address" required>
              <input
                required
                value={customer.address}
                onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))}
                className={inputClass}
                autoComplete="street-address"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="City" required>
                <input
                  required
                  value={customer.city}
                  onChange={(e) => setCustomer((c) => ({ ...c, city: e.target.value }))}
                  className={inputClass}
                  autoComplete="address-level2"
                />
              </Field>
              <Field label="Postal code" required>
                <input
                  required
                  value={customer.postalCode}
                  onChange={(e) => setCustomer((c) => ({ ...c, postalCode: e.target.value }))}
                  className={inputClass}
                  autoComplete="postal-code"
                />
              </Field>
              <Field label="Country" required>
                <select
                  value={customer.country}
                  onChange={(e) => setCustomer((c) => ({ ...c, country: e.target.value }))}
                  className={inputClass}
                >
                  {["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"].map(
                    (country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    )
                  )}
                </select>
              </Field>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-1 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
              <Lock size={16} /> Payment
            </legend>
            <p className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              <ShieldCheck size={14} /> This is a demo store. No real payment is processed and card
              details are never transmitted.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Card number">
                <input placeholder="4242 4242 4242 4242" className={inputClass} inputMode="numeric" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry">
                  <input placeholder="MM/YY" className={inputClass} />
                </Field>
                <Field label="CVC">
                  <input placeholder="123" className={inputClass} inputMode="numeric" />
                </Field>
              </div>
            </div>
          </fieldset>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full sm:w-fit" disabled={isPending}>
            {isPending ? "Placing order…" : `Place order — ${formatPrice(total)}`}
          </Button>
        </form>

        <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Order summary</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {lines.map((line) => (
              <li key={`${line.slug}-${line.color ?? ""}-${line.size ?? ""}`} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <Image src={line.image} alt={line.name} fill className="object-cover" />
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-semibold text-white dark:bg-white dark:text-neutral-900">
                    {line.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-neutral-900 dark:text-white">
                    {line.name}
                  </p>
                  {(line.color || line.size) && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {[line.color, line.size].filter(Boolean).join(" / ")}
                    </p>
                  )}
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {formatPrice(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 flex flex-col gap-2 border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800">
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
            <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-semibold text-neutral-900 dark:border-neutral-800 dark:text-white">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-neutral-700 dark:text-neutral-200">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
