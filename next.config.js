/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = "inline-source-map";
    }
    return config;
  },
};

module.exports = nextConfig;
