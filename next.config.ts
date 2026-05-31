import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Avoid bundling heavy wallet dependencies on the server
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        '@injectivelabs/wallet-ts',
        'magic-sdk',
        '@magic-sdk/provider',
        '@magic-sdk/types',
        '@magic-ext/oauth2',
      ];
    }

    return config;
  },
};

export default nextConfig;
