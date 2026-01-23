import type { NextConfig } from "next";

// Add your backend URL here (the one that works on HTTP)
const BACKEND_URL = process.env.BACKEND_URL || 'http://ww40wcc8wsk4o8os80k4ccc8.72.61.229.220.sslip.io';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@mantine/charts', '@tabler/icons-react'],
  },
  async rewrites() {
    return [
      // Health check
      {
        source: '/health',
        destination: `${BACKEND_URL}/health`,
      },
      // Auth routes
      {
        source: '/auth',
        destination: `${BACKEND_URL}/auth`,
      },
      {
        source: '/auth/:path*',
        destination: `${BACKEND_URL}/auth/:path*`,
      },
      // Task routes
      {
        source: '/tasks',
        destination: `${BACKEND_URL}/tasks`,
      },
      {
        source: '/tasks/:path*',
        destination: `${BACKEND_URL}/tasks/:path*`,
      },
      // Billing routes
      {
        source: '/billing',
        destination: `${BACKEND_URL}/billing`,
      },
      {
        source: '/billing/:path*',
        destination: `${BACKEND_URL}/billing/:path*`,
      },
    ];
  },
};

export default nextConfig;



