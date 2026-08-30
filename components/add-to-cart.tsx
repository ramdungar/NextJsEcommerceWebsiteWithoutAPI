"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-context";

export function AddToCart({ productId }: { productId: string }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(productId, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-lg border border-slate-300">
        <button
          type="button"
          className="px-3 py-2 text-lg text-slate-600 hover:text-slate-900"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-8 text-center font-medium" data-testid="qty">
          {quantity}
        </span>
        <button
          type="button"
          className="px-3 py-2 text-lg text-slate-600 hover:text-slate-900"
          onClick={() => setQuantity((value) => value + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-lg bg-brand px-5 py-2.5 font-medium text-white transition hover:bg-brand-dark"
        data-testid="detail-add-to-cart"
      >
        {added ? "Added!" : "Add to cart"}
      </button>
    </div>
  );
}
