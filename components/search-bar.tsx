"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { searchProductsAction, type SearchSuggestion } from "@/lib/actions";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = query.trim();
    const timeout = setTimeout(
      () => {
        startTransition(async () => {
          if (term.length < 2) {
            setSuggestions([]);
            return;
          }
          const results = await searchProductsAction(term);
          setSuggestions(results);
        });
      },
      term.length < 2 ? 0 : 200
    );
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function goToSearch(term: string) {
    setIsOpen(false);
    router.push(term ? `/products?search=${encodeURIComponent(term)}` : "/products");
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          goToSearch(query.trim());
        }}
        className="relative"
      >
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products, brands, categories..."
          className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-9 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
            }}
          >
            <X size={14} />
          </button>
        )}
      </form>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          {isPending && (
            <p className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">Searching…</p>
          )}
          {!isPending && suggestions.length === 0 && (
            <p className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">
              No matches for &ldquo;{query}&rdquo;
            </p>
          )}
          {!isPending &&
            suggestions.map((suggestion) => (
              <Link
                key={suggestion.slug}
                href={`/products/${suggestion.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
                  <Image src={suggestion.image} alt={suggestion.name} fill className="object-cover" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-neutral-900 dark:text-white">
                    {suggestion.name}
                  </span>
                  <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                    {suggestion.brand}
                  </span>
                </span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {formatPrice(suggestion.price)}
                </span>
              </Link>
            ))}
          {!isPending && suggestions.length > 0 && (
            <button
              type="button"
              onClick={() => goToSearch(query.trim())}
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-indigo-600 hover:bg-neutral-100 dark:text-indigo-400 dark:hover:bg-neutral-800"
            >
              View all results for &ldquo;{query}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
