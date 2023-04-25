const withImages = require("next-images");
module.exports = withImages({
  experimental: { reactRefresh: false },
});
module.exports = {
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
