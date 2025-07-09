const c = require("ansi-colors")

// List of required environment variables with descriptions
const requiredEnvs = [
  {
    key: "NEXT_PUBLIC_MEDUSA_BACKEND_URL",
    description:
      "Your Medusa backend, should be updated to where you are hosting your server. Remember to update CORS settings for your server. See - https://docs.medusajs.com/usage/configurations#admin_cors-and-store_cors.",
  },
  {
    key: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    description:
      "Your publishable key that can be attached to sales channels. See - https://docs.medusajs.com/development/publishable-api-keys.",
  },
  {
    key: "NEXT_PUBLIC_BASE_URL",
    description:
      "Your store URL, should be updated to where you are hosting your storefront.",
  },
  {
    key: "NEXT_PUBLIC_DEFAULT_REGION",
    description:
      'Your preferred default region. When middleware cannot determine the user region from the "x-vercel-country" header, the default region will be used. ISO-2 lowercase format.',
  },
  {
    key: "NEXT_PUBLIC_STRIPE_KEY",
    description:
      "Your Stripe public key. See - https://docs.medusajs.com/add-plugins/stripe.",
  },
  // Add any other required variables here
]

// List of environment variables that should be valid URLs
const urlVars = [
  'NEXT_PUBLIC_BASE_URL',
  'NEXT_PUBLIC_MEDUSA_BACKEND_URL',
  'NEXT_PUBLIC_MINIO_ENDPOINT',
  'NEXT_PUBLIC_SEARCH_ENDPOINT',
]

function isInvalidUrl(value) {
  // Check if value is just protocol or empty
  if (!value || value === 'http://' || value === 'https://') return true
  try {
    // Try to construct a URL object; will throw if invalid
    new URL(value)
    return false
  } catch {
    return true
  }
}

function checkEnvVariables() {
  // Check for missing required environment variables
  const missingEnvs = requiredEnvs.filter(function (env) {
    return !process.env[env.key]
  })

  if (missingEnvs.length > 0) {
    console.error(
      c.red.bold("\n🚫 Error: Missing required environment variables\n")
    )

    missingEnvs.forEach(function (env) {
      console.error(c.yellow(`  ${c.bold(env.key)}`))
      if (env.description) {
        console.error(c.dim(`    ${env.description}\n`))
      }
    })

    console.error(
      c.yellow(
        "\nPlease set these variables in your .env file or environment before starting the application.\n"
      )
    )

    // In production builds, warn but don't exit to allow build to continue (optional)
    if (process.env.NODE_ENV === 'production' && process.env.CI) {
      console.warn(c.yellow("\n⚠️  Warning: Continuing build despite missing variables for deployment\n"))
      return
    }

    process.exit(1)
  }

  // Validate URL formats for all URL-based variables
  urlVars.forEach(function (varName) {
    const value = process.env[varName]
    // Only check if variable is set
    if (value) {
      if (isInvalidUrl(value)) {
        console.error(c.red.bold(`\n🚫 Error: ${varName} is not a valid URL or is incomplete (e.g., just protocol)\n`))
        console.error(c.yellow(`  Current value: ${value}`))
        console.error(c.yellow(`  Should be a complete URL, e.g., https://yourdomain.com\n`))

        if (!(process.env.NODE_ENV === 'production' && process.env.CI)) {
          process.exit(1)
        }
      }
    }
  })
}

// Export the function for use in build scripts or next.config.js
module.exports = checkEnvVariables
