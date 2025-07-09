"use client"

import { LayoutColumn } from "@/components/Layout"
import { Link } from "@/components/Link"
import { usePathname } from "next/navigation"

export const NoResults = () => {
  const pathname = usePathname()

  return (
    <LayoutColumn className="pt-28">
      <div className="flex justify-center flex-col items-center max-w-md mx-auto text-center">
        <div className="mb-8">
          {/* Empty State Icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <h3 className="text-xl font-cinzel font-normal mb-3 text-gray-900">No Products Found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any products matching your current criteria. Try adjusting your filters or browse our full collection.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            scroll={false}
            href={pathname}
            className="inline-flex items-center justify-center px-6 py-3 bg-nxl-gold text-white font-medium rounded-md hover:bg-nxl-gold/90 transition-colors"
          >
            Clear All Filters
          </Link>

          <Link
            href="/"
            className="block text-gray-600 hover:text-nxl-gold transition-colors"
          >
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </LayoutColumn>
  )
}
