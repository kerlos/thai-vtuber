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
  },
};

export default withNextIntl(nextConfig);
