"use client"

import { twJoin } from "tailwind-merge"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/Button"
import PaymentButton from "@modules/checkout/components/payment-button"
import { StoreCart } from "@medusajs/types"
import { useTranslations } from 'next-intl'

const Review = ({ cart, translations: propTranslations, locale }: { cart: StoreCart, translations?: Record<string, string>, locale?: string }) => {
  // Hybrid translation pattern: use prop, then hook, then fallback
  let t: (key: string) => string
  if (propTranslations) {
    t = (key) => propTranslations[key as string] || (key as string)
  } else {
    try {
      const hookT = useTranslations('ReviewStep')
      t = (key) => hookT(key as string)
    } catch {
      t = (key) => {
        const fallbacks: Record<string, string> = {
          heading: locale === 'fr' ? '5. Revue' : '5. Review',
          placeOrder: locale === 'fr' ? 'Passer la commande' : 'Place Order',
          back: locale === 'fr' ? 'Retour' : 'Back',
          confirmText: locale === 'fr'
            ? "En cliquant sur le bouton Passer la commande, vous confirmez avoir lu, compris et accepté nos Conditions d'utilisation, Conditions de vente et Politique de retour, et reconnaissez avoir lu la Politique de confidentialité de Medusa Store."
            : "By clicking the Place Order button, you confirm that you have read, understand and accept our Terms of Use, Terms of Sale and Returns Policy and acknowledge that you have read Medusa Store's Privacy Policy."
        }
        return fallbacks[key as string] || (key as string)
      }
    }
  }

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "review"

  // const paidByGiftcard =
  //   cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0
  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods &&
    cart.shipping_methods.length > 0 &&
    cart.payment_collection

  return (
    <>
      <div className="flex justify-between mb-6 md:mb-8 border-t border-grayscale-200 pt-8 mt-8">
        <div>
          <p
            className={twJoin(
              "transition-fontWeight duration-75",
              isOpen && "font-semibold"
            )}
          >
            {t('heading')}
          </p>
        </div>
        {!isOpen &&
          previousStepsCompleted &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Button
              variant="link"
              onPress={() => {
                router.push(pathname + "?step=review", { scroll: false })
              }}
            >
              {/* Use translation for 'View' if needed */}
              View
            </Button>
          )}
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <p className="mb-8">
            {t('confirmText')}
          </p>
          <PaymentButton
            cart={cart}
            selectPaymentMethod={() => {
              router.push(pathname + "?step=payment", { scroll: false })
            }}
          // You may want to pass translated button text to PaymentButton as well
          />
        </>
      )}
    </>
  )
}

export default Review
