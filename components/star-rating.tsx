import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  reviewCount,
  size = 14,
  className,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index + 1 <= Math.round(rating);
          return (
            <Star
              key={index}
              size={size}
              className={cn(
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-neutral-300 dark:text-neutral-600"
              )}
            />
          );
        })}
      </div>
      <span className="text-xs text-neutral-500 dark:text-neutral-400">
        {rating.toFixed(1)}
        {typeof reviewCount === "number" ? ` (${reviewCount})` : ""}
      </span>
    </div>
  );
}
