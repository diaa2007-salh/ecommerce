/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  // Allows importing SVGs as React components
  webpack(config) {
    return config;
  },
};

module.exports = nextConfig;
