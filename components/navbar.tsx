import Link from "next/link";
import { getAllCategories } from "@/lib/data";
import { SearchBar } from "@/components/search-bar";
import { CartButton } from "@/components/cart-button";
import { WishlistNavLink } from "@/components/wishlist-nav-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";

export async function Navbar() {
  const categories = await getAllCategories();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <MobileNav categories={categories} />
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            S
          </span>
          <span className="hidden sm:inline">Storefront</span>
        </Link>

        <div className="mx-2 hidden max-w-md flex-1 md:block">
          <SearchBar />
        </div>

        <nav className="ml-auto hidden items-center gap-5 text-sm font-medium text-neutral-700 lg:flex dark:text-neutral-200">
          <Link href="/products" className="hover:text-neutral-950 dark:hover:text-white">
            Shop
          </Link>
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="hover:text-neutral-950 dark:hover:text-white"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-4">
          <ThemeToggle />
          <WishlistNavLink />
          <CartButton />
        </div>
      </div>

      <div className="border-t border-neutral-100 px-4 pb-3 pt-2 md:hidden dark:border-neutral-900">
        <SearchBar />
      </div>
    </header>
  );
}
