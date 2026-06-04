import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@injectivelabs/sdk-ts', '@injectivelabs/networks'],
  // Silence the Turbopack/webpack mismatch warning on Next.js 16
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
