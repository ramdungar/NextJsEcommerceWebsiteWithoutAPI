"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

export interface CartLine {
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  color?: string;
  size?: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  addItem: (product: Product, options?: { color?: string; size?: string; quantity?: number }) => void;
  removeItem: (slug: string, color?: string, size?: string) => void;
  updateQuantity: (slug: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

function lineKey(slug: string, color?: string, size?: string) {
  return [slug, color ?? "", size ?? ""].join("::");
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      addItem: (product, options) => {
        const quantity = options?.quantity ?? 1;
        const key = lineKey(product.slug, options?.color, options?.size);
        set((state) => {
          const existing = state.lines.find(
            (line) => lineKey(line.slug, line.color, line.size) === key
          );
          if (existing) {
            const nextQuantity = Math.min(existing.quantity + quantity, product.stock || existing.quantity);
            return {
              lines: state.lines.map((line) =>
                lineKey(line.slug, line.color, line.size) === key
                  ? { ...line, quantity: nextQuantity }
                  : line
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0],
                category: product.category,
                stock: product.stock,
                color: options?.color,
                size: options?.size,
                quantity: Math.min(quantity, product.stock || quantity),
              },
            ],
          };
        });
        get().openCart();
      },
      removeItem: (slug, color, size) => {
        const key = lineKey(slug, color, size);
        set((state) => ({
          lines: state.lines.filter((line) => lineKey(line.slug, line.color, line.size) !== key),
        }));
      },
      updateQuantity: (slug, quantity, color, size) => {
        const key = lineKey(slug, color, size);
        set((state) => ({
          lines: state.lines
            .map((line) =>
              lineKey(line.slug, line.color, line.size) === key
                ? { ...line, quantity: Math.max(1, Math.min(quantity, line.stock || quantity)) }
                : line
            )
            .filter((line) => line.quantity > 0),
        }));
      },
      clearCart: () => set({ lines: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "storefront-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
    }
  )
);

export function selectCartTotals(lines: CartLine[]) {
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.price, 0);
  return { totalItems, subtotal };
}
