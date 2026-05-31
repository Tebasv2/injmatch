import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {},
  serverExternalPackages: [
    '@injectivelabs/wallet-ts',
    '@injectivelabs/sdk-ts',
    '@injectivelabs/networks',
    '@injectivelabs/wallet-strategy',
    '@ledgerhq/errors',
    '@ledgerhq/devices',
    '@ledgerhq/hw-transport',
    'magic-sdk',
    '@magic-sdk/provider',
    '@magic-sdk/types',
    '@magic-ext/oauth2',
  ],
};

export default nextConfig;
