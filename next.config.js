/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  // Disable static generation, use SSR only
  output: 'standalone',

  images: {
    // Enable modern formats for smaller file sizes
    formats: ['image/avif', 'image/webp'],
    // Fine-tune responsive sizes to match actual layout breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Enable gzip compression
  compress: true,
};

module.exports = nextConfig;
