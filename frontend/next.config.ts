import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@mantine/charts', '@tabler/icons-react'],
  },
  // Note: Rewrites removed for Vercel deployment
  // Frontend now calls backend API directly via NEXT_PUBLIC_API_URL
};

export default nextConfig;

