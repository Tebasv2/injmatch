import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@injectivelabs/wallet-ts',
    '@injectivelabs/sdk-ts',
    '@injectivelabs/networks',
    '@ledgerhq/errors',
    '@ledgerhq/devices',
    '@ledgerhq/hw-transport',
    'magic-sdk',
    '@magic-sdk/provider',
    '@magic-sdk/types',
    '@magic-ext/oauth2',
  ],
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
