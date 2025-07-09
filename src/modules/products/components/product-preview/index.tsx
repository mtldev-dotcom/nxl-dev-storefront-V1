import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { useTranslations } from 'next-intl' // For i18n
import clsx from 'clsx' // For conditional classNames

export default function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  // Get translation function for the 'Product' namespace
  const t = useTranslations('Product')

  // Get the price info for the product
  const { cheapestPrice } = getProductPrice({
    product: product,
  })

  // Determine if the product is discounted
  const hasReducedPrice =
    cheapestPrice &&
    cheapestPrice.calculated_price_number <
    (cheapestPrice?.original_price_number || 0)

  // Determine if the product is new (created within last 30 days)
  const isNew = product.created_at &&
    new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  // Fallback image if product image is missing
  const fallbackImage = "/images/content/next-level-store2.png" // Use a branded fallback

  // Calculate discount percentage
  const discountPercentage = hasReducedPrice && cheapestPrice
    ? Math.round(((cheapestPrice.original_price_number! - cheapestPrice.calculated_price_number) / cheapestPrice.original_price_number!) * 100)
    : 0

  /**
   * Utility to determine if a variant is in stock.
   * Handles both Medusa Inventory Module and legacy setups.
   * See: https://docs.medusajs.com/resources/commerce-modules/inventory
   */
  function isVariantInStock(variant: any): boolean {
    // Inventory Module: check inventory_items (array of inventory at locations)
    if (variant.inventory_items && Array.isArray(variant.inventory_items)) {
      // Sum available_quantity across all inventory items (locations)
      const totalAvailable = variant.inventory_items.reduce(
        (sum: number, item: any) => sum + (item.available_quantity || 0),
        0
      );
      return totalAvailable > 0;
    }
    // Legacy: use inventory_quantity
    return (variant.inventory_quantity ?? 0) > 0;
  }

  /**
   * Determines if the product is sold out (all variants out of stock).
   * If there are no variants, treat as sold out for safety.
   */
  const isSoldOut =
    !product.variants ||
    product.variants.length === 0 ||
    product.variants.every((variant: any) => !isVariantInStock(variant));

  // Helper: Format price as 'CAD 125.00' (currency code small, price large, no symbol)
  // Do NOT divide by 100; backend returns price in correct decimal format
  function renderPrice(priceObj: any) {
    if (!priceObj) return null
    const { calculated_price_number, currency_code } = priceObj
    // Format number with two decimals, no symbol
    const formatted = new Intl.NumberFormat(undefined, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(calculated_price_number)
    return (
      <>
        <span className="text-xs text-grayscale-500 font-medium mr-1 align-top">{currency_code}</span>
        <span className="text-lg font-bold align-baseline">{formatted}</span>
      </>
    )
  }

  return (
    // Root card container: compact, modern, equal-height
    <div className="group relative h-full flex flex-col bg-white rounded-xl overflow-hidden border border-grayscale-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-nxl-gold hover:-translate-y-1">
      <LocalizedLink
        href={`/products/${product.handle}`}
        className="block flex-1 focus:outline-none focus:ring-2 focus:ring-nxl-gold/60 focus:ring-offset-2 rounded-xl"
        tabIndex={0}
        aria-label={`View ${product.title} details`}
      >
        {/* Product Image Container */}
        <div className="relative aspect-square w-full bg-grayscale-50 overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail || fallbackImage}
            images={product.images}
            size="square"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Enhanced Overlay with Quick Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
            {/*  View Details Button - Appears on Hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <div className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm shadow-lg border border-nxl-gold/20 hover:bg-nxl-gold hover:text-white transition-colors duration-200">
                View Details
              </div>
            </div>
          </div>

          {/* Enhanced Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* New Badge */}
            {isNew && !isSoldOut && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded uppercase tracking-widest font-bold shadow-md">
                New
              </span>
            )}

            {/* Sale Badge with Discount Percentage */}
            {hasReducedPrice && !isSoldOut && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded uppercase tracking-widest font-bold shadow-md">
                {discountPercentage > 0 ? `-${discountPercentage}%` : 'Sale'}
              </span>
            )}
          </div>

          {/* Sold Out Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-grayscale-900 text-white text-sm px-4 py-2 rounded uppercase tracking-widest font-bold shadow-lg">
                Sold Out
              </span>
            </div>
          )}

          {/* Wishlist Button - Top Right */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              className="bg-white/90 hover:bg-white text-grayscale-700 hover:text-red-500 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110"
              aria-label={`Add ${product.title} to wishlist`}
              onClick={(e) => {
                e.preventDefault()
                // TODO: Implement wishlist functionality
                console.log('Add to wishlist:', product.id)
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Category */}
          {product.collection && (
            <p className="text-nxl-gold text-[10px] font-semibold uppercase tracking-wider mb-1">
              {product.collection.title}
            </p>
          )}
          {/* Title - compact, bold, clamped */}
          <h3 className="font-playfair text-base font-bold text-grayscale-900 mb-1 line-clamp-2 group-hover:text-nxl-gold transition-colors duration-200"
            title={product.title}>
            {product.title}
          </h3>
          {/* Description - subtle, clamped, min height for uniformity */}
          {product.description && (
            <p className="text-grayscale-600 text-xs mb-2 line-clamp-2 min-h-[32px] leading-snug">
              {product.description}
            </p>
          )}
          {/* Price and Stock Section - price right-aligned */}
          <div className="mt-auto flex flex-col gap-1">
            {cheapestPrice ? (
              <div className="flex items-end justify-between w-full">
                {/* Stock Status Indicator (left) */}
                <div className="flex items-center gap-1">
                  {isSoldOut && (
                    <span className="bg-grayscale-900 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-widest font-bold shadow-lg">
                      Sold Out
                    </span>
                  )}
                  {!isSoldOut && (
                    <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                      In Stock
                    </span>
                  )}
                </div>
                {/* Price (right-aligned) */}
                <div className="flex items-end ml-auto">
                  {hasReducedPrice ? (
                    <>
                      <span className="font-montserrat font-bold text-nxl-gold text-base">
                        {renderPrice(cheapestPrice)}
                      </span>
                      <span className="font-montserrat text-grayscale-400 line-through text-xs ml-2">
                        {renderPrice({ ...cheapestPrice, calculated_price_number: cheapestPrice.original_price_number })}
                      </span>
                    </>
                  ) : (
                    <span className="font-montserrat font-bold text-grayscale-900 text-base">
                      {renderPrice(cheapestPrice)}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-grayscale-500 font-medium text-xs text-right block w-full">
                Price on Request
              </span>
            )}
          </div>
          {/* Ratings Placeholder */}
          <div className="mt-2 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3 h-3 text-grayscale-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-[10px] text-grayscale-500 ml-1">
              {/* Future: Display actual ratings */}
              No reviews yet
            </span>
          </div>
        </div>
      </LocalizedLink>
      {/* Add to Cart Button - compact, always at the bottom */}
      <div className="p-3 pt-0">
        <button
          className={clsx(
            "w-full py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-300 transform",
            isSoldOut
              ? "bg-grayscale-100 text-grayscale-400 cursor-not-allowed"
              : "bg-nxl-gold text-white hover:bg-grayscale-900 hover:shadow-lg hover:scale-105 active:scale-95"
          )}
          disabled={isSoldOut}
          onClick={(e) => {
            e.preventDefault()
            if (!isSoldOut) {
              // TODO: Implement add to cart functionality
              console.log('Add to cart:', product.id)
            }
          }}
          aria-label={`Add ${product.title} to cart`}
        >
          {isSoldOut
            ? 'Sold Out'
            : 'Add to Cart'
          }
        </button>
      </div>
    </div>
  )
}
