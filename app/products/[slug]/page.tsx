import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getAllProducts, getCategoryBySlug, getProductBySlug, getRelatedProducts } from "@/lib/data";
import { ProductGallery } from "@/components/product-gallery";
import { PriceTag } from "@/components/price-tag";
import { StarRating } from "@/components/star-rating";
import { WishlistButton } from "@/components/wishlist-button";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { SectionHeading } from "@/components/section-heading";
import { ProductGrid } from "@/components/product-grid";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategoryBySlug(product.category),
    getRelatedProducts(product, 4),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
        <Link href="/products" className="hover:text-neutral-900 dark:hover:text-white">
          Shop
        </Link>
        <ChevronRight size={14} />
        {category && (
          <>
            <Link
              href={`/products?category=${category.slug}`}
              className="hover:text-neutral-900 dark:hover:text-white"
            >
              {category.name}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="line-clamp-1 text-neutral-700 dark:text-neutral-300">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {product.isNew && <Badge variant="accent">New</Badge>}
            {product.compareAtPrice && <Badge variant="success">Sale</Badge>}
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {product.brand}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <div className="flex items-center gap-3">
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} currency={product.currency} size="lg" />
            <WishlistButton slug={product.slug} productName={product.name} />
          </div>

          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {product.description}
          </p>

          <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <AddToCartForm product={product} />
          </div>

          {product.highlights.length > 0 && (
            <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
              <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-white">Highlights</h2>
              <ul className="flex flex-col gap-1.5 text-sm text-neutral-600 dark:text-neutral-300">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading title="You might also like" />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
