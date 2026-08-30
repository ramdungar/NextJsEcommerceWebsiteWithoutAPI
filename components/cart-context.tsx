"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/lib/products";

export type CartItem = {
  id: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (id: string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  detailedItems: Array<{ product: Product; quantity: number }>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "ecommerce-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored) as CartItem[]);
      }
    } catch {
      // Ignore malformed storage and start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const addToCart = (id: string, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((item) => item.id === id);
        if (existing) {
          return current.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...current, { id, quantity }];
      });
    };

    const removeFromCart = (id: string) => {
      setItems((current) => current.filter((item) => item.id !== id));
    };

    const setQuantity = (id: string, quantity: number) => {
      setItems((current) =>
        quantity <= 0
          ? current.filter((item) => item.id !== id)
          : current.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
      );
    };

    const clearCart = () => setItems([]);

    const detailedItems = items
      .map((item) => {
        const product = products.find((candidate) => candidate.id === item.id);
        return product ? { product, quantity: item.quantity } : null;
      })
      .filter((entry): entry is { product: Product; quantity: number } =>
        Boolean(entry),
      );

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = detailedItems.reduce(
      (sum, entry) => sum + entry.product.price * entry.quantity,
      0,
    );

    return {
      items,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      totalItems,
      totalPrice,
      detailedItems,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
