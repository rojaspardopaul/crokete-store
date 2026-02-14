/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  // Disable static generation, use SSR only
  output: 'standalone',
  // Skip static generation during build
  experimental: {
    isrMemoryCacheSize: 0,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
