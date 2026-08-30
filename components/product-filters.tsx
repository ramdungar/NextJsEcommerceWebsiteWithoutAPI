"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductFilters({
  categories,
  priceBounds,
}: {
  categories: Category[];
  priceBounds: { min: number; max: number };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeCategory = searchParams.get("category") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const hasActiveFilters = Boolean(activeCategory || minPrice || maxPrice);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handlePriceSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    updateParams({
      minPrice: (formData.get("minPrice") as string) || null,
      maxPrice: (formData.get("maxPrice") as string) || null,
    });
  }

  const content = (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">Category</h3>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => updateParams({ category: null })}
            className={cn(
              "rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
              activeCategory === ""
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            )}
          >
            All categories
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => updateParams({ category: category.slug })}
              className={cn(
                "rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
                activeCategory === category.slug
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">Price range</h3>
        <form onSubmit={handlePriceSubmit} className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            min={priceBounds.min}
            max={priceBounds.max}
            defaultValue={minPrice}
            placeholder={`${priceBounds.min}`}
            className="w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-900 outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
          <span className="text-neutral-400">–</span>
          <input
            type="number"
            name="maxPrice"
            min={priceBounds.min}
            max={priceBounds.max}
            defaultValue={maxPrice}
            placeholder={`${priceBounds.max}`}
            className="w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-900 outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
          <Button type="submit" size="sm" variant="secondary">
            Go
          </Button>
        </form>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => updateParams({ category: null, minPrice: null, maxPrice: null })}
          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          <X size={14} /> Clear filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="gap-2"
        >
          <SlidersHorizontal size={14} /> Filters
        </Button>
      </div>

      <aside className="hidden w-56 shrink-0 lg:block">{content}</aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex h-full w-72 flex-col gap-6 overflow-y-auto bg-white p-5 shadow-xl dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">Filters</span>
              <Button variant="ghost" size="icon" aria-label="Close filters" onClick={() => setIsMobileOpen(false)}>
                <X size={18} />
              </Button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
