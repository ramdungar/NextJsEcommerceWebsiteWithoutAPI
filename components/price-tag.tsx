import { formatDiscount, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PriceTag({
  price,
  compareAtPrice,
  currency = "USD",
  size = "md",
  className,
}: {
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const discount = formatDiscount(price, compareAtPrice ?? null);
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-neutral-900 dark:text-white", sizeClasses[size])}>
        {formatPrice(price, currency)}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-sm text-neutral-400 line-through dark:text-neutral-500">
          {formatPrice(compareAtPrice, currency)}
        </span>
      )}
      {discount && (
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          -{discount}%
        </span>
      )}
    </div>
  );
}
