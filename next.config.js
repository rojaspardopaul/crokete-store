/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      // Imágenes del catálogo: Supabase Storage (bucket público del proyecto).
      { protocol: "https", hostname: "mcvufmicaqrhgwdharub.supabase.co" },
      // TRANSITORIO: el backend en producción todavía sirve el catálogo desde
      // Mongo, cuyas URLs siguen apuntando a Cloudinary. Se puede quitar en
      // cuanto el corte a Postgres esté desplegado.
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Avatares de los proveedores OAuth.
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" },
      // Agrega aquí otros dominios de imágenes que uses
    ],
  },

  compress: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
