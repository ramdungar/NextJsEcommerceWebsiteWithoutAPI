import "server-only";

import categoriesJson from "@/data/categories.json";
import productsJson from "@/data/products.json";
import type { Category, PagedResult, Product, ProductQuery } from "@/lib/types";

/**
 * Data-access layer for the storefront.
 *
 * There is intentionally no `/api` route here: catalog data lives in local
 * JSON files (`data/products.json`, `data/categories.json`) that are imported
 * directly into this server-only module. Server Components call these
 * functions the same way they would call a database or fetch client, but the
 * "network hop" simply doesn't exist - the JSON is bundled with the server
 * and read/filtered/sorted in-process. Because this file imports
 * `server-only`, any accidental import from a Client Component fails at
 * build time instead of leaking the raw catalog into the browser bundle.
 */

const categories = categoriesJson as Category[];
const products = productsJson as Product[];

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
const productBySlug = new Map(products.map((product) => [product.slug, product]));

function simulateLatency() {
  // No-op placeholder: kept as a single seam in case this data layer is ever
  // swapped for a real database or remote service - callers already treat
  // every export as asynchronous.
  return Promise.resolve();
}

export async function getAllCategories(): Promise<Category[]> {
  await simulateLatency();
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  await simulateLatency();
  return categoryBySlug.get(slug);
}

export async function getAllProducts(): Promise<Product[]> {
  await simulateLatency();
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await simulateLatency();
  return productBySlug.get(slug);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  await simulateLatency();
  return products.filter((product) => product.featured).slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  await simulateLatency();
  return [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  await simulateLatency();
  return products
    .filter((candidate) => candidate.slug !== product.slug && candidate.category === product.category)
    .slice(0, limit);
}

export async function getPriceBounds(): Promise<{ min: number; max: number }> {
  await simulateLatency();
  const prices = products.map((product) => product.price);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
}

function matchesSearch(product: Product, search: string): boolean {
  const haystack = [product.name, product.brand, product.description, ...product.tags]
    .join(" ")
    .toLowerCase();
  return search
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function sortProducts(list: Product[], sort: ProductQuery["sort"]): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "featured":
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
  }
}

export async function queryProducts(query: ProductQuery = {}): Promise<PagedResult<Product>> {
  await simulateLatency();
  const { category, search, sort = "featured", minPrice, maxPrice, page = 1, pageSize = 12 } = query;

  let filtered = products;

  if (category) {
    filtered = filtered.filter((product) => product.category === category);
  }
  if (typeof minPrice === "number") {
    filtered = filtered.filter((product) => product.price >= minPrice);
  }
  if (typeof maxPrice === "number") {
    filtered = filtered.filter((product) => product.price <= maxPrice);
  }
  if (search && search.trim().length > 0) {
    filtered = filtered.filter((product) => matchesSearch(product, search));
  }

  const sortedList = sortProducts(filtered, sort);
  const total = sortedList.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = sortedList.slice(start, start + pageSize);

  return { items, page: safePage, pageSize, total, totalPages };
}

export async function searchSuggestions(search: string, limit = 6): Promise<Product[]> {
  await simulateLatency();
  if (!search.trim()) return [];
  return products.filter((product) => matchesSearch(product, search)).slice(0, limit);
}
