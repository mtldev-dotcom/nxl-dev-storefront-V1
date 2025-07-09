"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { twJoin } from "tailwind-merge"
import { convertToLocale } from "@lib/util/money"
import ErrorMessage from "@modules/checkout/components/error-message"
import { Button } from "@/components/Button"
import {
  UiRadio,
  UiRadioBox,
  UiRadioGroup,
  UiRadioLabel,
} from "@/components/ui/Radio"
import { useCartShippingMethods, useSetShippingMethod } from "hooks/cart"
import { StoreCart } from "@medusajs/types"
import { ShippingStepTranslations } from '../../../types/checkout-translations'
import { useTranslations } from 'next-intl'

const Shipping = ({ cart, translations: propTranslations, locale }: { cart: StoreCart, translations?: ShippingStepTranslations, locale?: string }) => {
  // Hybrid translation pattern: use prop, then hook, then fallback
  let t: (key: keyof ShippingStepTranslations) => string
  if (propTranslations) {
    t = (key) => propTranslations[key as string] || (key as string)
  } else {
    try {
      const hookT = useTranslations('ShippingStep')
      t = (key) => hookT(key as string)
    } catch {
      t = (key) => {
        const fallbacks: Record<string, string> = {
          heading: locale === 'fr' ? '3. Livraison' : '3. Shipping',
          standardShipping: locale === 'fr' ? 'Livraison standard' : 'Standard Shipping',
          expressShipping: locale === 'fr' ? 'Livraison express' : 'Express Shipping',
          next: locale === 'fr' ? 'Suivant' : 'Next',
          back: locale === 'fr' ? 'Retour' : 'Back',
        }
        return fallbacks[key as string] || (key as string)
      }
    }
  }

  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "shipping"

  const { data: availableShippingMethods } = useCartShippingMethods(cart.id)

  const { mutate, isPending } = useSetShippingMethod({ cartId: cart.id })
  const selectedShippingMethod = availableShippingMethods?.find(
    (method) => method.id === cart.shipping_methods?.[0]?.shipping_option_id
  )

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const set = (id: string) => {
    mutate(
      { shippingMethodId: id },
      { onError: (err) => setError(err.message) }
    )
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

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
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Button
              variant="link"
              onPress={() => {
                router.push(pathname + "?step=shipping", { scroll: false })
              }}
            >
              {/* Use translation for 'Change' if needed */}
              Change
            </Button>
          )}
      </div>
      {isOpen ? (
        availableShippingMethods?.length === 0 ? (
          <div>
            <p className="text-red-900">
              {/* This message could also be translated if desired */}
              There are no shipping methods available for your location. Please contact us for further assistance.
            </p>
          </div>
        ) : (
          <div>
            <UiRadioGroup
              className="flex flex-col gap-4 mb-8"
              value={selectedShippingMethod?.id}
              onChange={set}
              aria-label="Shipping methods"
            >
              {availableShippingMethods?.map((option) => (
                <UiRadio
                  key={option.id}
                  variant="outline"
                  value={option.id}
                  className="gap-4"
                >
                  <UiRadioBox />
                  {/* Use translation for shipping method names if they match known keys */}
                  <UiRadioLabel>
                    {option.name === 'Standard Shipping' ? t('standardShipping') :
                      option.name === 'Express Shipping' ? t('expressShipping') :
                        option.name}
                  </UiRadioLabel>
                  <UiRadioLabel className="ml-auto group-data-[selected=true]:font-normal">
                    {convertToLocale({
                      amount: option.amount!,
                      currency_code: cart?.currency_code,
                    })}
                  </UiRadioLabel>
                </UiRadio>
              ))}
            </UiRadioGroup>

            <ErrorMessage error={error} />

            <Button
              onPress={handleSubmit}
              isLoading={isPending}
              isDisabled={!cart.shipping_methods?.[0]}
            >
              {t('next')}
            </Button>
          </div>
        )
      ) : cart &&
        (cart.shipping_methods?.length ?? 0) > 0 &&
        selectedShippingMethod ? (
        <ul className="flex max-sm:flex-col flex-wrap gap-y-2 gap-x-28">
          <li className="text-grayscale-500">{t('heading')}</li>
          <li className="text-grayscale-600">{selectedShippingMethod.name}</li>
        </ul>
      ) : null}
    </>
  )
}

export default Shipping
