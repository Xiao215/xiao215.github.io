import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Emit `route/index.html` so GitHub Pages serves both `/travel` and
  // `/travel/` instead of returning the 404 page for the slashed form.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
