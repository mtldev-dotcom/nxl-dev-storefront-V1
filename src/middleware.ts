import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import { routing } from './i18n/routing';

// Fix URL format - ensure it has protocol and remove trailing slash
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.startsWith('http')
  ? process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL.replace(/\/$/, '')
  : `https://${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.replace(/\/$/, '')}`

const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    try {
      // Skip region fetch during build time or if no backend URL
      if (!BACKEND_URL || !PUBLISHABLE_API_KEY) {
        // Create a default region map for missing config
        const defaultRegion = {
          id: 'default',
          name: 'Default Region',
          currency_code: 'usd',
          countries: [{ iso_2: DEFAULT_REGION }]
        } as HttpTypes.StoreRegion

        regionMapCache.regionMap.set(DEFAULT_REGION, defaultRegion)
        regionMapCache.regionMapUpdated = Date.now()
        return regionMapCache.regionMap
      }

      console.log('Fetching regions from:', BACKEND_URL)
      console.log('Using publishable key:', PUBLISHABLE_API_KEY ? 'Present' : 'Missing')

      // Fetch regions from Medusa with timeout and better error handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
        signal: controller.signal,
        next: {
          revalidate: 3600,
          tags: ["regions"],
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Failed to fetch regions: ${response.status}`)
      }

      const { regions } = await response.json()

      if (!regions?.length) {
        // Create default region if no regions found
        const defaultRegion = {
          id: 'default',
          name: 'Default Region',
          currency_code: 'usd',
          countries: [{ iso_2: DEFAULT_REGION }]
        } as HttpTypes.StoreRegion

        regionMapCache.regionMap.set(DEFAULT_REGION, defaultRegion)
      } else {
        // Create a map of country codes to regions.
        regions.forEach((region: HttpTypes.StoreRegion) => {
          region.countries?.forEach((c) => {
            regionMapCache.regionMap.set(c.iso_2 ?? "", region)
          })
        })
      }

      regionMapCache.regionMapUpdated = Date.now()
    } catch (error) {
      console.error('Failed to fetch regions:', error)

      // Determine error type for better debugging
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('Region fetch timed out')
        } else if (error.message.includes('fetch')) {
          console.error('Network error fetching regions')
        } else {
          console.error('Unknown error:', error.message)
        }
      }

      // Create a fallback region map
      const defaultRegion = {
        id: 'default',
        name: 'Default Region',
        currency_code: 'usd',
        countries: [{ iso_2: DEFAULT_REGION }]
      } as HttpTypes.StoreRegion

      regionMapCache.regionMap.set(DEFAULT_REGION, defaultRegion)
      regionMapCache.regionMapUpdated = Date.now()
    }
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
      )
    }
  }
}

/**
 * Middleware to handle region selection and internationalization.
 */
export async function middleware(request: NextRequest) {
  try {
    const regionMap = await getRegionMap()
    const countryCode = regionMap && (await getCountryCode(request, regionMap))

    const pathname = request.nextUrl.pathname
    const pathSegments = pathname.split('/').filter(Boolean)

    // Parse the URL structure: /[countryCode]/[locale]/...rest
    const urlCountryCode = pathSegments[0]
    const urlLocale = pathSegments[1]

    // Check if we have a valid country code
    const hasValidCountryCode = urlCountryCode && regionMap?.has(urlCountryCode)

    // Check if we have a valid locale
    const hasValidLocale = urlLocale && (routing.locales as readonly string[]).includes(urlLocale)

    // Prevent redirect loops by checking if we're already in the correct format
    const isCorrectFormat = hasValidCountryCode && hasValidLocale

    if (isCorrectFormat) {
      // URL is already in the correct format: /countryCode/locale/...
      const response = NextResponse.next()
      response.headers.set('x-pathname', pathname)
      return response
    }

    // Determine the target country code
    const targetCountryCode = hasValidCountryCode ? urlCountryCode : (countryCode || DEFAULT_REGION)

    // Determine the target locale (default to 'en' for now, can be enhanced with browser detection)
    const targetLocale = hasValidLocale ? urlLocale : routing.defaultLocale

    // Construct the new URL
    let newPathSegments: string[] = [targetCountryCode, targetLocale]

    if (hasValidCountryCode && hasValidLocale) {
      // Should not reach here due to isCorrectFormat check above
      return NextResponse.next()
    } else if (hasValidCountryCode && !hasValidLocale) {
      // URL like /ca/store -> /ca/en/store
      newPathSegments = [targetCountryCode, targetLocale, ...pathSegments.slice(1)]
    } else if (!hasValidCountryCode && hasValidLocale) {
      // URL like /en/store -> /ca/en/store (unusual case)
      newPathSegments = [targetCountryCode, targetLocale, ...pathSegments.slice(1)]
    } else {
      // URL like /store -> /ca/en/store
      newPathSegments = [targetCountryCode, targetLocale, ...pathSegments]
    }

    // Handle root path
    if (pathname === '/') {
      newPathSegments = [targetCountryCode, targetLocale]
    }

    // Construct the redirect URL
    const newPathname = '/' + newPathSegments.join('/')
    const queryString = request.nextUrl.search
    const redirectUrl = new URL(newPathname + queryString, request.url)

    return NextResponse.redirect(redirectUrl, 307)

  } catch (error) {
    console.error('Middleware error:', error)

    // Fallback to basic routing without region detection
    const pathname = request.nextUrl.pathname

    // If already has locale format, continue
    if (pathname.match(/^\/[a-z]{2}\/[a-z]{2}(\/.*)?$/)) {
      return NextResponse.next()
    }

    // Otherwise redirect to default region/locale
    const fallbackUrl = new URL(`/${DEFAULT_REGION}/en${pathname}`, request.url)
    return NextResponse.redirect(fallbackUrl, 307)
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico|_next/image|images|robots.txt).*)",
  ],
}
