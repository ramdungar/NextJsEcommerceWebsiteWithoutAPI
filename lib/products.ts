export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  emoji: string;
  rating: number;
};

export const products: Product[] = [
  {
    id: "aurora-headphones",
    name: "Aurora Wireless Headphones",
    price: 129.99,
    category: "Audio",
    description:
      "Over-ear wireless headphones with active noise cancellation and 30-hour battery life.",
    emoji: "🎧",
    rating: 4.7,
  },
  {
    id: "nimbus-keyboard",
    name: "Nimbus Mechanical Keyboard",
    price: 89.0,
    category: "Accessories",
    description:
      "Hot-swappable mechanical keyboard with tactile switches and per-key RGB lighting.",
    emoji: "⌨️",
    rating: 4.8,
  },
  {
    id: "lumen-desk-lamp",
    name: "Lumen Smart Desk Lamp",
    price: 54.5,
    category: "Home",
    description:
      "Adjustable LED desk lamp with wireless charging base and adaptive brightness.",
    emoji: "💡",
    rating: 4.5,
  },
  {
    id: "terra-water-bottle",
    name: "Terra Insulated Bottle",
    price: 24.99,
    category: "Lifestyle",
    description:
      "Double-walled stainless steel bottle that keeps drinks cold for 24 hours.",
    emoji: "🍶",
    rating: 4.6,
  },
  {
    id: "pulse-smartwatch",
    name: "Pulse Fitness Smartwatch",
    price: 179.0,
    category: "Wearables",
    description:
      "Tracks heart rate, sleep, and workouts with a bright always-on AMOLED display.",
    emoji: "⌚",
    rating: 4.4,
  },
  {
    id: "vega-backpack",
    name: "Vega Everyday Backpack",
    price: 69.99,
    category: "Lifestyle",
    description:
      "Water-resistant backpack with a padded laptop sleeve and hidden anti-theft pocket.",
    emoji: "🎒",
    rating: 4.9,
  },
  {
    id: "orbit-mouse",
    name: "Orbit Ergonomic Mouse",
    price: 39.99,
    category: "Accessories",
    description:
      "Silent-click wireless mouse shaped for all-day comfort and precision tracking.",
    emoji: "🖱️",
    rating: 4.3,
  },
  {
    id: "sol-speaker",
    name: "Sol Portable Speaker",
    price: 59.0,
    category: "Audio",
    description:
      "Compact waterproof Bluetooth speaker with rich bass and 12-hour playtime.",
    emoji: "🔊",
    rating: 4.6,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
