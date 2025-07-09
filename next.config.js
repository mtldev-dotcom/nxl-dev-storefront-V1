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
    domains: [
      "medusa-public-images.s3.eu-west-1.amazonaws.com",
      // Add other domains as needed
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "fashion-starter-demo.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "pub-adb42a8f4cada5f8c2c67f6a9eb2ddb6.r2.dev",
      },
    ],
  },
}

module.exports = withNextIntl(nextConfig)
