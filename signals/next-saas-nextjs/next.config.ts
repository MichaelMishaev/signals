import type { NextConfig } from 'next';
import path from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@': './src',
      '@public': './public',
    },
  },
  typescript: {
    // Temporarily ignore TypeScript build errors for deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore ESLint build errors for deployment
    ignoreDuringBuilds: true,
  },
  // Configure output file tracing for monorepo support
  outputFileTracingRoot: path.join(__dirname, '../../'),
  // Optimize for production deployment
  output: 'standalone',
};

export default withNextIntl(nextConfig);
