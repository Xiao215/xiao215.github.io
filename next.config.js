// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig

const withImages = require("next-images");
module.exports = withImages();
module.exports = {
  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      "/": { page: "/" },
      "/resume": { page: "/resume" },
      "/contact": { page: "/contact" },
    };
  },
  reactStrictMode: true,
  swcMinify: true,
};
