"use client"
import { HttpTypes, StoreProduct } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Layout, LayoutColumn } from "@/components/Layout"
import { NoResults } from "@modules/store/components/no-results.tsx"
import { withReactQueryProvider } from "@lib/util/react-query"
import * as React from "react"
import { useStoreProducts } from "hooks/store"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

const PRODUCT_LIMIT = 12

function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  typeId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string | string[]
  categoryId?: string | string[]
  typeId?: string | string[]
  productsIds?: string[]
  countryCode: string
}) {
  // Build query parameters with enhanced filtering support
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: PRODUCT_LIMIT,
  }

  // Enhanced collection filtering - support for multiple collections
  if (collectionId) {
    queryParams["collection_id"] = Array.isArray(collectionId)
      ? collectionId
      : [collectionId]
  }

  // Enhanced category filtering - support for multiple categories
  if (categoryId) {
    queryParams["category_id"] = Array.isArray(categoryId)
      ? categoryId
      : [categoryId]
  }

  // Enhanced type filtering - support for multiple types
  if (typeId) {
    queryParams["type_id"] = Array.isArray(typeId) ? typeId : [typeId]
  }

  // Product IDs filtering for specific product sets
  if (productsIds) {
    queryParams["id"] = productsIds
  }

  // Enhanced sorting with more options
  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  } else if (sortBy === "price_asc") {
    queryParams["order"] = "calculated_price"
  } else if (sortBy === "price_desc") {
    queryParams["order"] = "-calculated_price"
  }

  // Use the enhanced products query hook
  const productsQuery = useStoreProducts({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  // Enhanced intersection observer for infinite scroll with better performance
  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!loadMoreRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && productsQuery.hasNextPage && !productsQuery.isFetchingNextPage) {
          productsQuery.fetchNextPage()
        }
      },
      {
        rootMargin: "200px", // Load earlier for smoother experience
        threshold: 0.1
      }
    )

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [productsQuery, loadMoreRef])

  // Show loading skeleton on initial load
  if (productsQuery.isPending) {
    return <SkeletonProductGrid />
  }

  // Get all products from all pages
  const allProducts = productsQuery?.data?.pages.flatMap((page) =>
    page?.response?.products || []
  ) || []

  return (
    <div className="w-full">
      {/* Products Grid with Enhanced Layout */}
      {allProducts.length > 0 && (!productsIds || productsIds.length > 0) ? (
        <>
          {/* Enhanced responsive grid with better spacing and hover effects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-12">
            {allProducts.map((product: StoreProduct) => {
              return (
                <div
                  key={product.id}
                  className="group transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <ProductPreview product={product} />
                </div>
              )
            })}
          </div>

          {/* Enhanced Loading Indicator for Infinite Scroll */}
          {productsQuery.hasNextPage && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {productsQuery.isFetchingNextPage ? (
                <div className="flex items-center space-x-2 text-grayscale-600">
                  <div className="w-5 h-5 border-2 border-nxl-gold border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Loading more products...</span>
                </div>
              ) : (
                <div className="w-8 h-8 border-2 border-grayscale-300 border-t-nxl-gold rounded-full animate-spin opacity-50"></div>
              )}
            </div>
          )}

          {/* Products count indicator */}
          <div className="text-center text-sm text-grayscale-500 mt-8">
            Showing {allProducts.length} products
            {productsQuery.hasNextPage && " • Scroll to load more"}
          </div>
        </>
      ) : (
        // Enhanced No Results component with better messaging
        <NoResults />
      )}
    </div>
  )
}

export default withReactQueryProvider(PaginatedProducts)
