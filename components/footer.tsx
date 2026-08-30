import Link from "next/link";
import { getAllCategories } from "@/lib/data";
import { NewsletterForm } from "@/components/newsletter-form";

export async function Footer() {
  const categories = await getAllCategories();

  return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                S
              </span>
              Storefront
            </Link>
            <p className="mt-3 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
              A demo storefront built with Next.js, TypeScript, and Tailwind - powered entirely by a
              local JSON catalog and Server Components instead of a REST API.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Shop</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/products?category=${category.slug}`} className="hover:text-neutral-900 dark:hover:text-white">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Account</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <li>
                <Link href="/cart" className="hover:text-neutral-900 dark:hover:text-white">Cart</Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-neutral-900 dark:hover:text-white">Wishlist</Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-neutral-900 dark:hover:text-white">Checkout</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Stay in the loop</h3>
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              Get new arrivals and offers in your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <p className="mt-10 border-t border-neutral-200 pt-6 text-xs text-neutral-400 dark:border-neutral-800">
          © {new Date().getFullYear()} Storefront. Built for demo purposes only.
        </p>
      </div>
    </footer>
  );
}
