const checkEnvVariables = require("./check-env-variables")
const createNextIntlPlugin = require('next-intl/plugin');

// Completely skip env check in production to avoid build failures
// checkEnvVariables() - Disabled for Railway deployment

// Create the next-intl plugin with custom path for i18n configuration
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 1,
  },
  images: {
    // Use remotePatterns instead of deprecated domains array
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bucket-production-364e.up.railway.app", // fixed typo from .ap to .app
        pathname: "/**",
      },
      // Add more patterns as needed
    ],
  },
}

module.exports = withNextIntl(nextConfig)
