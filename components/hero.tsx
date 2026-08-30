import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.25),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.2),transparent_45%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:py-28 lg:px-8">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
            <Sparkles size={14} /> New arrivals every week
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Everyday essentials, thoughtfully curated.
          </h1>
          <p className="mt-4 text-base text-white/70 sm:text-lg">
            Electronics, fashion, home goods, and more — hand-picked and delivered with a shopping
            experience built for speed, from browsing to checkout.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className={buttonVariants({ size: "lg" })}>
              Shop all products <ArrowRight size={16} />
            </Link>
            <Link
              href="/products?sort=newest"
              className={buttonVariants({ variant: "outline", size: "lg", className: "border-white/30 text-white hover:bg-white/10" })}
            >
              New arrivals
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Truck size={18} /> Free shipping over $75
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <ShieldCheck size={18} /> Secure checkout
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Sparkles size={18} /> Curated, quality-first catalog
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
