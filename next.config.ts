/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
