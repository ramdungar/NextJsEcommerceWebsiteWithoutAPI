import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  title,
  description,
  href,
  linkLabel = "View all",
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-neutral-700 hover:text-neutral-950 sm:flex dark:text-neutral-300 dark:hover:text-white"
        >
          {linkLabel} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
