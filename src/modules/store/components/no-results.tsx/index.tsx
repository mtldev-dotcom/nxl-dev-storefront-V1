"use client"

import { LayoutColumn } from "@/components/Layout"
import { Link } from "@/components/Link"
import { LocalizedLink } from "@/components/LocalizedLink"
import { usePathname, useSearchParams } from "next/navigation"

export const NoResults = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Check if any filters are applied
  const hasFilters = searchParams.toString().length > 0

  // Get applied filter types for messaging
  const appliedFilters = {
    categories: searchParams.getAll('category'),
    collections: searchParams.getAll('collection'),
    types: searchParams.getAll('type'),
    sortBy: searchParams.get('sortBy')
  }

  const totalFilters = Object.values(appliedFilters).flat().filter(Boolean).length

  return (
    <div className="w-full py-16 md:py-24">
      <div className="max-w-lg mx-auto text-center">
        {/* Enhanced Empty State Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-grayscale-100 to-grayscale-200 rounded-full flex items-center justify-center shadow-inner">
            {/* Modern Search Icon with Better Design */}
            <div className="relative">
              <svg className="w-16 h-16 text-grayscale-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="absolute inset-0 border-2 border-nxl-gold/30 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* On-brand Messaging Based on Filter State */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-cinzel font-normal text-grayscale-900">
              {hasFilters
                ? "No products match your current selection."
                : "No products found."
              }
            </h3>
            <div className="space-y-2">
              {hasFilters ? (
                <>
                  <p className="text-grayscale-600 leading-relaxed">
                    {`We couldn't find any products with your chosen filters. Refresh your style—clear your filters or explore our latest arrivals.`}
                  </p>
                  {totalFilters > 0 && (
                    <div className="bg-grayscale-50 rounded-lg p-4 mt-4">
                      <p className="text-sm font-medium text-grayscale-700 mb-2">
                        {`Active Filters:`}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(appliedFilters).map(([key, values]) =>
                          Array.isArray(values) ? values.map((value, index) => (
                            <span key={`${key}-${index}`} className="bg-nxl-gold/10 text-nxl-gold px-2 py-1 rounded text-xs font-medium">
                              {value}
                            </span>
                          )) : values ? (
                            <span key={key} className="bg-nxl-gold/10 text-nxl-gold px-2 py-1 rounded text-xs font-medium">
                              {values}
                            </span>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-grayscale-600 leading-relaxed">
                  {`Elevate your look. Explore our latest arrivals and discover versatile style for every moment.`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* On-brand Action Buttons */}
        <div className="space-y-4">
          {hasFilters && (
            <Link
              scroll={false}
              href={pathname}
              className="inline-flex items-center justify-center w-full px-6 py-4 bg-nxl-gold text-white font-medium rounded-lg hover:bg-nxl-gold/90 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Clear All Filters
            </Link>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LocalizedLink
              href="/"
              className="inline-flex items-center justify-center px-4 py-3 border border-grayscale-300 text-grayscale-700 bg-white rounded-lg hover:bg-grayscale-50 hover:border-nxl-gold transition-all duration-300"
            >
              ← Back to Home
            </LocalizedLink>

            <LocalizedLink
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-3 border border-grayscale-300 text-grayscale-700 bg-white rounded-lg hover:bg-grayscale-50 hover:border-nxl-gold transition-all duration-300"
            >
              Contact Our Team
            </LocalizedLink>
          </div>
        </div>

        {/* Suggested Categories or Popular Products */}
        <div className="mt-12 pt-8 border-t border-grayscale-200">
          <h4 className="font-cinzel text-lg font-normal text-grayscale-900 mb-6">
            Discover More
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <LocalizedLink
              href="/store?category=furniture"
              className="group p-4 bg-white border border-grayscale-200 rounded-lg hover:border-nxl-gold hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-nxl-gold/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-nxl-gold/20 transition-colors">
                <svg className="w-6 h-6 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-grayscale-700 group-hover:text-nxl-gold transition-colors">
                Furniture
              </span>
            </LocalizedLink>

            <LocalizedLink
              href="/store?category=decor"
              className="group p-4 bg-white border border-grayscale-200 rounded-lg hover:border-nxl-gold hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-nxl-gold/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-nxl-gold/20 transition-colors">
                <svg className="w-6 h-6 text-nxl-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-grayscale-700 group-hover:text-nxl-gold transition-colors">
                Home Decor
              </span>
            </LocalizedLink>
          </div>
        </div>
      </div>
    </div>
  )
}
