import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {},
  serverExternalPackages: [
    '@injectivelabs/wallet-ts',
    'magic-sdk',
    '@magic-sdk/provider',
    '@magic-sdk/types',
    '@magic-ext/oauth2',
  ],
};

export default nextConfig;
