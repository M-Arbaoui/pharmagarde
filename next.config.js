/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tile.openstreetmap.org',
      },
      {
        protocol: 'https',
        hostname: '*.basemaps.cartocdn.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
  // Output standalone for optimal Docker/Vercel performance
  output: 'standalone',
  // Disable powered-by header
  poweredByHeader: false,
  // Compress responses
  compress: true,
  // Trailing slashes for consistency
  trailingSlash: false,
}

module.exports = withNextIntl(nextConfig)
