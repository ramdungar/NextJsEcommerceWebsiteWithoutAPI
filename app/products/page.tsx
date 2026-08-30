import type { Metadata } from "next";
import { getAllCategories, getPriceBounds, queryProducts } from "@/lib/data";
import type { SortOption } from "@/lib/types";
import { ProductGrid } from "@/components/product-grid";
import { ProductFilters } from "@/components/product-filters";
import { SortSelect } from "@/components/sort-select";
import { Pagination } from "@/components/pagination";

export const metadata: Metadata = {
  title: "Shop all products",
  description: "Browse the full Storefront catalog with filters for category, price, and search.",
};

const SORT_OPTIONS: SortOption[] = ["featured", "newest", "price-asc", "price-desc", "rating"];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  const category = firstValue(resolvedSearchParams.category) || undefined;
  const search = firstValue(resolvedSearchParams.search) || undefined;
  const sortParam = firstValue(resolvedSearchParams.sort);
  const sort = (SORT_OPTIONS as string[]).includes(sortParam ?? "") ? (sortParam as SortOption) : "featured";
  const minPriceRaw = firstValue(resolvedSearchParams.minPrice);
  const maxPriceRaw = firstValue(resolvedSearchParams.maxPrice);
  const pageRaw = firstValue(resolvedSearchParams.page);

  const minPrice = minPriceRaw ? Number(minPriceRaw) : undefined;
  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined;
  const page = pageRaw ? Number(pageRaw) : 1;

  const [{ items, totalPages, page: currentPage, total }, categories, priceBounds] = await Promise.all([
    queryProducts({ category, search, sort, minPrice, maxPrice, page, pageSize: 12 }),
    getAllCategories(),
    getPriceBounds(),
  ]);

  const activeCategoryName = categories.find((c) => c.slug === category)?.name;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          {activeCategoryName ?? "All products"}
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {search ? (
            <>
              {total} result{total === 1 ? "" : "s"} for &ldquo;{search}&rdquo;
            </>
          ) : (
            <>{total} product{total === 1 ? "" : "s"}</>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <ProductFilters categories={categories} priceBounds={priceBounds} />

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-end">
            <SortSelect />
          </div>
          <ProductGrid products={items} />
          <Pagination page={currentPage} totalPages={totalPages} searchParams={resolvedSearchParams} />
        </div>
      </div>
    </div>
  );
}
