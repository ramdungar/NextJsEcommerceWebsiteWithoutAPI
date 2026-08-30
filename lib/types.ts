export interface Category {
  slug: string;
  name: string;
  description: string;
  accent: string;
  image: string;
}

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  isNew: boolean;
  createdAt: string;
  tags: string[];
  colors: string[];
  sizes?: string[];
  description: string;
  highlights: string[];
  images: string[];
}

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export interface ProductQuery {
  category?: string;
  search?: string;
  sort?: SortOption;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
