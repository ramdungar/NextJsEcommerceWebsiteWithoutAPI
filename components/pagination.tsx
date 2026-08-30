import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (totalPages <= 1) return null;

  function hrefForPage(target: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === "page" || value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    });
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (candidate) => Math.abs(candidate - page) <= 1 || candidate === 1 || candidate === totalPages
  );

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      <Link
        href={hrefForPage(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300",
          page === 1 && "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages.map((candidate, index) => {
        const previous = pages[index - 1];
        const showEllipsis = previous !== undefined && candidate - previous > 1;
        return (
          <span key={candidate} className="flex items-center gap-1.5">
            {showEllipsis && <span className="px-1 text-neutral-400">…</span>}
            <Link
              href={hrefForPage(candidate)}
              aria-current={candidate === page ? "page" : undefined}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium",
                candidate === page
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "border border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              )}
            >
              {candidate}
            </Link>
          </span>
        );
      })}

      <Link
        href={hrefForPage(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300",
          page === totalPages && "pointer-events-none opacity-40"
        )}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
