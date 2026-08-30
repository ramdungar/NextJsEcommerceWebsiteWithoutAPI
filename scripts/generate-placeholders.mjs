// One-off generator for local SVG placeholder artwork so the storefront
// never depends on external image hosts. Run with: node scripts/generate-placeholders.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const categories = JSON.parse(
  await import("node:fs").then((fs) =>
    fs.readFileSync(path.join(root, "data/categories.json"), "utf-8")
  )
);
const products = JSON.parse(
  await import("node:fs").then((fs) =>
    fs.readFileSync(path.join(root, "data/products.json"), "utf-8")
  )
);

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const bigint = parseInt(value, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function shade(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  const mix = (channel) =>
    amount >= 0 ? channel + (255 - channel) * amount : channel * (1 + amount);
  return `rgb(${clamp(mix(r))}, ${clamp(mix(g))}, ${clamp(mix(b))})`;
}

function initials(name) {
  return name
    .split(" ")
    .filter((w) => /[a-zA-Z0-9]/.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function wrapLabel(name, maxChars = 22) {
  const words = name.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current.trim());
  return lines.slice(0, 2);
}

function productSvg({ accent, name, variant }) {
  const angle = variant === 2 ? 135 : 45;
  const from = shade(accent, variant === 2 ? 0.18 : -0.05);
  const to = shade(accent, variant === 2 ? -0.35 : 0.35);
  const lines = wrapLabel(name);
  const label = initials(name);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bg" gradientTransform="rotate(${angle})">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)" />
  <circle cx="640" cy="140" r="220" fill="white" opacity="0.06" />
  <circle cx="120" cy="700" r="180" fill="white" opacity="0.06" />
  <circle cx="400" cy="400" r="150" fill="white" opacity="0.12" />
  <text x="400" y="418" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="92" font-weight="700" fill="white" opacity="0.92">${label}</text>
  <text x="400" y="700" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="30" font-weight="600" fill="white" opacity="0.85">
    ${lines
      .map((line, i) => `<tspan x="400" dy="${i === 0 ? 0 : 38}">${line}</tspan>`)
      .join("")}
  </text>
</svg>`;
}

function categorySvg({ accent, name }) {
  const from = shade(accent, -0.1);
  const to = shade(accent, 0.3);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="960" height="540" fill="url(#bg)" />
  <circle cx="820" cy="90" r="220" fill="white" opacity="0.08" />
  <circle cx="90" cy="480" r="180" fill="white" opacity="0.08" />
  <text x="60" y="320" font-family="'Segoe UI', Arial, sans-serif" font-size="56" font-weight="700" fill="white">${name}</text>
</svg>`;
}

const productsDir = path.join(root, "public/products");
const categoriesDir = path.join(root, "public/categories");
mkdirSync(productsDir, { recursive: true });
mkdirSync(categoriesDir, { recursive: true });

const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

for (const product of products) {
  const category = categoryBySlug.get(product.category);
  const accent = category?.accent ?? "#6366f1";
  for (const variant of [1, 2]) {
    const svg = productSvg({ accent, name: product.name, variant });
    writeFileSync(path.join(productsDir, `${product.slug}-${variant}.svg`), svg, "utf-8");
  }
}

for (const category of categories) {
  const svg = categorySvg(category);
  writeFileSync(path.join(categoriesDir, `${category.slug}.svg`), svg, "utf-8");
}

console.log(
  `Generated ${products.length * 2} product images and ${categories.length} category banners.`
);
