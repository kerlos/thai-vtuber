import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Uses default path: ./i18n/request.ts
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "*.ytimg.com",
      },
    ],
    // Reduce image optimization costs
    formats: ['image/webp'], // Use only WebP instead of AVIF + WebP to reduce transformations
    minimumCacheTTL: 2678400, // Cache images for 31 days (YouTube images rarely change)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Tailored to common device sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Sizes for avatar and thumbnails
    // Reduce quality slightly to decrease cache size
    dangerouslyAllowSVG: false,
  },
};

export default withNextIntl(nextConfig);
