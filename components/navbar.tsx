"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          Nimbus<span className="text-brand">Shop</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-slate-900">
            Products
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-white transition hover:bg-brand-dark"
            data-testid="cart-link"
          >
            <span>Cart</span>
            <span
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-brand"
              data-testid="cart-count"
            >
              {totalItems}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
