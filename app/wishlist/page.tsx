import type { Metadata } from "next";
import { getAllProducts } from "@/lib/data";
import { WishlistView } from "@/components/wishlist-view";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Products you've saved for later.",
};

export default async function WishlistPage() {
  // The wishlist itself only lives in localStorage (via the Zustand store),
  // but the product details it references come straight from the JSON
  // catalog fetched here on the server.
  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">Wishlist</h1>
      <WishlistView products={products} />
    </div>
  );
}
