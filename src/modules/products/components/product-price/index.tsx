import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"

export default function ProductPrice({
  product,
  variant,
  locale = 'en-US', // Default to en-US if not provided
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  locale?: string // Added for locale-aware formatting
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-grayscale-50 animate-pulse" />
  }

  // --- Custom price formatting for split style ---
  // Use Intl.NumberFormat with currencyDisplay: 'code' to get e.g. 'CAD 50.00' or '50,00 CAD'
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: selectedPrice.currency_code ?? '',
    currencyDisplay: 'code',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const formatted = formatter.format(selectedPrice.calculated_price_number ?? 0)
  // Extract currency code and amount using regex (works for most locales)
  const match = formatted.match(/([A-Z]{3})\s?([\d.,\s]+)|([\d.,\s]+)\s?([A-Z]{3})/i)
  let currency = selectedPrice.currency_code?.toUpperCase() || ''
  let amount = formatted
  if (match) {
    if (match[1] && match[2]) {
      // e.g. 'CAD 50.00'
      currency = match[1].toUpperCase()
      amount = match[2]
    } else if (match[3] && match[4]) {
      // e.g. '50,00 CAD'
      amount = match[3]
      currency = match[4].toUpperCase()
    }
  }

  // --- End custom formatting ---

  return (
    <div className="flex flex-col items-start mb-8">
      {/* Currency code in small, light, uppercase text */}
      <span className="text-xs text-gray-400 uppercase leading-none mb-0.5">{currency}</span>
      {/* Amount in bold, large text */}
      <span className="text-2xl font-bold leading-none">{amount}</span>
    </div>
  )
}
