import type { ReactNode } from "react";
import { PackageSearch } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 px-6 py-16 text-center dark:border-neutral-700">
      <PackageSearch className="text-neutral-400" size={40} />
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
      )}
      {action}
    </div>
  );
}
