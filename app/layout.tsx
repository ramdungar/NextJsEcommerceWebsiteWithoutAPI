import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "NimbusShop — Next.js E-commerce",
  description: "A demo e-commerce storefront built with Next.js, no external API required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
          <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-sm text-slate-400">
            NimbusShop — demo storefront. No real orders are placed.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
