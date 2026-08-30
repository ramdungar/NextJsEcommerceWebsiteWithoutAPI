import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryCard({ category, priority = false }: { category: Category; priority?: boolean }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative flex h-40 flex-col justify-end overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="relative z-10 p-4">
        <p className="text-lg font-semibold text-white">{category.name}</p>
        <p className="text-xs text-white/80">{category.description}</p>
      </div>
    </Link>
  );
}
