import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@mantine/charts', '@tabler/icons-react'],
  },
};

export default nextConfig;
