/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  // Disable static generation, use SSR only
  output: 'standalone',

  // Allow mobile devices on LAN to access dev server
  allowedDevOrigins: ['http://192.168.0.14:3000'],

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
