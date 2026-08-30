"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SortOption } from "@/lib/types";

const options: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "featured";

  return (
    <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
      Sort by
      <select
        value={currentSort}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("sort", event.target.value);
          params.delete("page");
          router.push(`${pathname}?${params.toString()}`);
        }}
        className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-900 outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
