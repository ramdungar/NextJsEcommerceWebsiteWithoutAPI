"use server";

import { getProductBySlug, searchSuggestions } from "@/lib/data";

/**
 * Server Actions - the App Router's replacement for hand-rolled `/api`
 * endpoints. Client Components import and call these functions directly;
 * Next.js transparently turns the call into an RPC to the server, where we
 * read/validate against the local JSON catalog (`lib/data.ts`). No REST
 * handlers, no client-trusted prices - just a typed function call.
 */

export interface SearchSuggestion {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
}

export async function searchProductsAction(query: string): Promise<SearchSuggestion[]> {
  const matches = await searchSuggestions(query, 6);
  return matches.map((product) => ({
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
    image: product.images[0],
  }));
}

export interface OrderLineInput {
  slug: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface CustomerInput {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderLineResult {
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  color?: string;
  size?: string;
}

export interface OrderResult {
  orderId: string;
  placedAt: string;
  customer: CustomerInput;
  items: OrderLineResult[];
  subtotal: number;
  shipping: number;
  total: number;
  estimatedDelivery: string;
}

export interface OrderActionError {
  error: string;
}

const FREE_SHIPPING_THRESHOLD = 75;
const STANDARD_SHIPPING = 6.99;

export async function placeOrderAction(
  lines: OrderLineInput[],
  customer: CustomerInput
): Promise<OrderResult | OrderActionError> {
  if (lines.length === 0) {
    return { error: "Your cart is empty." };
  }
  if (!customer.name || !customer.email || !customer.address || !customer.city) {
    return { error: "Please complete all required shipping details." };
  }

  const items: OrderLineResult[] = [];

  for (const line of lines) {
    // Re-fetch from the JSON data layer so pricing/stock is always
    // server-verified rather than trusted from the client payload.
    const product = await getProductBySlug(line.slug);
    if (!product) {
      return { error: `Product "${line.slug}" is no longer available.` };
    }
    if (product.stock < line.quantity) {
      return { error: `${product.name} only has ${product.stock} left in stock.` };
    }
    items.push({
      slug: product.slug,
      name: product.name,
      unitPrice: product.price,
      quantity: line.quantity,
      lineTotal: Math.round(product.price * line.quantity * 100) / 100,
      color: line.color,
      size: line.size,
    });
  }

  const subtotal = Math.round(items.reduce((sum, item) => sum + item.lineTotal, 0) * 100) / 100;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING;
  const total = Math.round((subtotal + shipping) * 100) / 100;

  const placedAt = new Date();
  const estimatedDelivery = new Date(placedAt.getTime() + 5 * 24 * 60 * 60 * 1000);

  return {
    orderId: `ORD-${placedAt.getTime().toString(36).toUpperCase()}`,
    placedAt: placedAt.toISOString(),
    customer,
    items,
    subtotal,
    shipping,
    total,
    estimatedDelivery: estimatedDelivery.toISOString(),
  };
}

