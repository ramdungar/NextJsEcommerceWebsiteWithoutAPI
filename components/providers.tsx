"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { CartDrawer } from "@/components/cart-drawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <CartDrawer />
      <Toaster position="bottom-right" richColors closeButton />
    </ThemeProvider>
  );
}
