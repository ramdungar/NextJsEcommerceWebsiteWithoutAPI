import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid Next.js auto-generating AGENTS.md/CLAUDE.md into the repo on every dev/build run.
  agentRules: false,
  images: {
    // Product/category artwork is generated locally as SVG (see scripts/generate-placeholders.mjs)
    // so we never depend on an external image host or a live API.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
