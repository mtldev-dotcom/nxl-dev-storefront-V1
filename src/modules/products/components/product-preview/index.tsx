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

  // Determine if the product is sold out (no variants in stock)
  const isSoldOut =
    product.variants?.every(
      (variant) =>
        !variant.inventory_quantity || variant.inventory_quantity <= 0
    ) ?? false

  // Fallback image if product image is missing
  const fallbackImage = "/images/content/next-level-store2.png" // Use a branded fallback

  return (
    <LocalizedLink
      href={`/products/${product.handle}`}
      className={clsx(
        // Card base styles
        "block group rounded-lg overflow-hidden border border-grayscale-200 bg-white shadow-sm transition-all duration-300 h-full",
        // Hover/focus styles
        "hover:shadow-lg hover:border-nxl-gold focus:outline-none focus:ring-2 focus:ring-nxl-gold/60"
      )}
      tabIndex={0} // Ensure card is focusable
      aria-label={product.title}
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-grayscale-100 flex items-center justify-center">
        <Thumbnail
          thumbnail={product.thumbnail || fallbackImage}
          images={product.images}
          size="square"
          className="mb-4 md:mb-6 transition-transform duration-300 group-hover:scale-105"
        // Note: alt text is handled inside Thumbnail, not as a prop
        />
        {/* Sold Out Badge */}
        {isSoldOut && (
          <span className="absolute top-2 left-2 bg-grayscale-900 text-white text-xs px-2 py-1 rounded uppercase tracking-widest font-semibold z-10 opacity-90">
            {t('soldOut', { defaultValue: 'Sold Out' })}
          </span>
        )}
        {/* Sale Badge */}
        {hasReducedPrice && !isSoldOut && (
          <span className="absolute top-2 right-2 bg-nxl-gold text-black text-xs px-2 py-1 rounded uppercase tracking-widest font-semibold z-10 opacity-90">
            {t('sale', { defaultValue: 'Sale' })}
          </span>
        )}
      </div>
      {/* Product Info */}
      <div className="flex flex-col gap-1 px-3 pb-4">
        {/* Product Title */}
        <p className="mb-1 font-playfair text-base md:text-lg lg:text-xl font-semibold text-grayscale-900 truncate" title={product.title}>
          {product.title}
        </p>
        {/* Collection Title (if present) */}
        {product.collection && (
          <p className="text-grayscale-500 text-xs md:text-sm font-montserrat max-md:hidden truncate" title={product.collection.title}>
            {product.collection.title}
          </p>
        )}
        {/* Price Section */}
        {cheapestPrice ? (
          <div className="flex items-center gap-2 mt-1">
            {/* Discounted Price */}
            {hasReducedPrice ? (
              <>
                <span className="font-montserrat font-bold text-nxl-gold text-base md:text-lg">
                  {cheapestPrice.calculated_price}
                </span>
                <span className="font-montserrat text-grayscale-400 line-through text-sm md:text-base">
                  {cheapestPrice.original_price}
                </span>
              </>
            ) : (
              // Regular Price
              <span className="font-montserrat font-bold text-grayscale-900 text-base md:text-lg">
                {cheapestPrice.calculated_price}
              </span>
            )}
          </div>
        ) : null}
      </div>
    </LocalizedLink>
  )
}
