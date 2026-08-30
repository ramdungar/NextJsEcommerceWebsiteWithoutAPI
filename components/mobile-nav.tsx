"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative flex h-full w-72 flex-col gap-1 bg-white p-5 shadow-xl dark:bg-neutral-900">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-bold text-neutral-900 dark:text-white">Browse</span>
              <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </Button>
            </div>
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
            >
              All products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                {category.name}
              </Link>
            ))}
            <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Wishlist
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
