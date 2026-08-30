import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
  accent: "bg-indigo-600 text-white",
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-500 text-white",
  outline: "border border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-200",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
