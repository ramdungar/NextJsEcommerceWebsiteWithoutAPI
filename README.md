# Storefront — Next.js Ecommerce (JSON-powered, no REST API)

A full-stack-feeling ecommerce storefront built with the Next.js App Router, TypeScript,
Tailwind CSS v4, and Zustand — with **no `/api` routes**. The entire product catalog lives
in local JSON files that are read directly by Server Components and Server Actions.

## Why no API routes?

Instead of exposing a REST/GraphQL API and having the frontend `fetch()` it, this app treats
the JSON catalog as a lightweight embedded database:

- `data/products.json` and `data/categories.json` hold the catalog.
- `lib/data.ts` is a **server-only** module (guarded by the [`server-only`](https://www.npmjs.com/package/server-only)
  package) that imports the JSON directly and exposes typed query functions
  (`getAllProducts`, `queryProducts`, `getProductBySlug`, `getFeaturedProducts`, etc.).
- **Server Components** (pages, `Navbar`, `Footer`) call these functions directly during
  render — there's no network hop, no client-trusted data, and no API layer to keep in sync.
- **Server Actions** (`lib/actions.ts`, `"use server"`) replace the handful of things a
  traditional API route would otherwise handle:
  - `searchProductsAction` — live search-suggestion lookups called from the client search bar.
  - `placeOrderAction` — recomputes prices/stock from the trusted JSON source (never from
    client input) and returns an order confirmation.

This keeps the mental model simple (plain async functions, fully typed end-to-end) while still
following the same Client/Server Component boundaries you'd use with a real database or CMS —
swapping the JSON files for a database later would only mean changing `lib/data.ts`.

## Tech stack

- **Next.js 16** (App Router, Server Components, Server Actions, Turbopack)
- **TypeScript** end to end
- **Tailwind CSS v4** for styling, with a class-based dark mode powered by `next-themes`
- **Zustand** (with the `persist` middleware) for client state:
  - `store/cart-store.ts` — cart lines, quantities, drawer open/close state (persisted to `localStorage`)
  - `store/wishlist-store.ts` — saved product slugs (persisted to `localStorage`)
- **lucide-react** for icons, **sonner** for toast notifications

## Project structure

```
data/                  Local "database": categories.json, products.json
lib/
  types.ts             Shared TypeScript types (Product, Category, ...)
  data.ts              Server-only data-access layer (reads the JSON directly)
  actions.ts           Server Actions (search suggestions, order placement)
  format.ts, utils.ts  Formatting + class-name helpers
  use-hydrated-store.ts, use-is-client.ts   SSR-safe hooks for persisted client state
store/
  cart-store.ts        Zustand cart store (persisted)
  wishlist-store.ts     Zustand wishlist store (persisted)
components/            Reusable UI (Navbar, ProductCard, CartDrawer, filters, forms, ...)
app/
  page.tsx             Home (hero, categories, featured, new arrivals)
  products/page.tsx    Catalog with search, category/price filters, sort, pagination
  products/[slug]/     Product detail (gallery, variants, related products)
  cart/page.tsx        Cart page
  checkout/page.tsx    Shipping form + mock payment, submits via a Server Action
  checkout/confirmation/  Order confirmation (read from sessionStorage)
  wishlist/page.tsx    Wishlist (server-fetched products + client-side saved slugs)
scripts/generate-placeholders.mjs   Generates the local SVG product/category artwork
```

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build                 # Production build
npm run start                 # Start the production build
npm run lint                  # ESLint
npm run generate:placeholders # Regenerate the local SVG product/category artwork
```

## Notes

- Product/category imagery is generated locally as SVG (`scripts/generate-placeholders.mjs`),
  so the app never depends on an external image host and works fully offline.
- Checkout is a realistic, fully client-validated flow, but is a **demo**: no real payment is
  processed and card fields are never read or transmitted anywhere.
