// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig

const withImages = require("next-images");
module.exports = withImages({
  experimental: { reactRefresh: false },
});
module.exports = {
  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      "/": { page: "/", query: { __nextDefaultLocale: true } },
      "/resume": { page: "/resume", query: { __nextDefaultLocale: true } },
      "/contact": { page: "/contact", query: { __nextDefaultLocale: true } },
    };
  },

  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "http://127.0.0.1:5000/:path*",
      },
    ];
  },
};
