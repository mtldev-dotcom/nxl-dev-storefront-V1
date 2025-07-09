"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { twJoin } from "tailwind-merge"
import compareAddresses from "@lib/util/compare-addresses"
import { SubmitButton } from "@modules/common/components/submit-button"
import BillingAddress from "@modules/checkout/components/billing_address"
import ErrorMessage from "@modules/checkout/components/error-message"
import ShippingAddress from "@modules/checkout/components/shipping-address"
import { Button } from "@/components/Button"
import { Form } from "@/components/Forms"
import { z } from "zod"
import { useCustomer } from "hooks/customer"
import { useSetShippingAddress } from "hooks/cart"
import { StoreCart } from "@medusajs/types"
import { CheckoutDeliveryTranslations } from "../../../types/checkout"
import { useTranslations } from "next-intl"

const addressesFormSchema = z
  .object({
    shipping_address: z.object({
      first_name: z.string().min(1),
      last_name: z.string().min(1),
      company: z.string().optional(),
      address_1: z.string().min(1),
      address_2: z.string().optional(),
      city: z.string().min(1),
      postal_code: z.string().min(1),
      province: z.string().optional(),
      country_code: z.string().min(2),
      phone: z.string().optional(),
    }),
  })
  .and(
    z.discriminatedUnion("same_as_billing", [
      z.object({
        same_as_billing: z.literal("on"),
      }),
      z.object({
        same_as_billing: z.literal("off").optional(),
        billing_address: z.object({
          first_name: z.string().min(1),
          last_name: z.string().min(1),
          company: z.string().optional(),
          address_1: z.string().min(1),
          address_2: z.string().optional(),
          city: z.string().min(1),
          postal_code: z.string().min(1),
          province: z.string().optional(),
          country_code: z.string().min(2),
          phone: z.string().optional(),
        }),
      }),
    ])
  )

// Refactored Addresses component to use hybrid translation pattern for i18n
const Addresses = ({ cart, translations, locale }: {
  cart: StoreCart,
  translations?: CheckoutDeliveryTranslations,
  locale?: string
}) => {
  // Translation function: use prop if provided, else hook, else locale fallback
  let t: (key: keyof CheckoutDeliveryTranslations) => string
  if (translations) {
    t = (key) => translations[key as string] || (key as string)
  } else {
    try {
      const hookT = useTranslations('Checkout')
      t = (key) => hookT(key as string)
    } catch {
      t = (key) => {
        // Fallbacks for reliability
        const fallbacks: Record<string, string> = {
          stepDelivery: locale === 'fr' ? '2. Détails de livraison' : '2. Delivery details',
          firstName: locale === 'fr' ? 'Prénom' : 'First name',
          lastName: locale === 'fr' ? 'Nom' : 'Last name',
          address: locale === 'fr' ? 'Adresse' : 'Address',
          company: locale === 'fr' ? 'Entreprise' : 'Company',
          postalCode: locale === 'fr' ? 'Code postal' : 'Postal code',
          city: locale === 'fr' ? 'Ville' : 'City',
          country: locale === 'fr' ? 'Pays' : 'Country',
          stateProvince: locale === 'fr' ? 'Province / État' : 'State / Province',
          phone: locale === 'fr' ? 'Téléphone' : 'Phone',
          billingSameAsShipping: locale === 'fr' ? "L'adresse de facturation est la même que l'adresse de livraison" : 'Billing address same as shipping address',
          next: locale === 'fr' ? 'Suivant' : 'Next',
        }
        return fallbacks[key as string] || (key as string)
      }
    }
  }

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const [sameAsBilling, setSameAsBilling] = React.useState(true)

  const { data: customer } = useCustomer()

  React.useEffect(() => {
    if (cart?.shipping_address && cart?.billing_address) {
      setSameAsBilling(
        compareAddresses(cart.shipping_address, cart.billing_address)
      )
    }
  }, [cart?.billing_address, cart?.shipping_address])

  const toggleSameAsBilling = React.useCallback(() => {
    setSameAsBilling((prev) => !prev)
  }, [setSameAsBilling])

  const { mutate, isPending, data } = useSetShippingAddress()

  const onSubmit = (values: z.infer<typeof addressesFormSchema>) => {
    mutate(values, {
      onSuccess: (data) => {
        if (isOpen && data.success) {
          router.push(pathname + "?step=shipping", { scroll: false })
        }
      },
    })
  }
  if (!cart) {
    return null
  }

  return (
    <>
      <div className="flex justify-between mb-6 md:mb-8 border-t border-grayscale-200 pt-8 mt-8">
        <div>
          {/* Step heading uses translation */}
          <p
            className={twJoin(
              "transition-fontWeight duration-75",
              isOpen && "font-semibold"
            )}
          >
            {t('stepDelivery')}
          </p>
        </div>
        {!isOpen && cart?.shipping_address && (
          <Button
            variant="link"
            onPress={() => {
              router.push(pathname + "?step=delivery")
            }}
          >
            {/* Use translation for 'Change' if needed */}
            Change
          </Button>
        )}
      </div>
      {isOpen ? (
        <Form
          schema={addressesFormSchema}
          onSubmit={onSubmit}
          formProps={{
            id: `email`,
          }}
          defaultValues={
            sameAsBilling
              ? {
                shipping_address: cart?.shipping_address || {
                  first_name: "",
                  last_name: "",
                  company: "",
                  province: "",
                  city: "",
                  postal_code: "",
                  country_code: "",
                  address_1: "",
                  address_2: "",
                  phone: "",
                },
                same_as_billing: "on",
              }
              : {
                shipping_address: cart?.shipping_address || {
                  first_name: "",
                  last_name: "",
                  company: "",
                  province: "",
                  city: "",
                  postal_code: "",
                  country_code: "",
                  address_1: "",
                  address_2: "",
                  phone: "",
                },
                same_as_billing: "off",
                billing_address: cart?.billing_address || {
                  first_name: "",
                  last_name: "",
                  company: "",
                  province: "",
                  city: "",
                  postal_code: "",
                  country_code: "",
                  address_1: "",
                  address_2: "",
                  phone: "",
                },
              }
          }
        >
          {({ watch }) => {
            const shippingData = watch("shipping_address")
            const isDisabled =
              !customer?.addresses?.length &&
              !Object.values(shippingData).some((value) => value)
            return (
              <>
                {/* Pass translations to ShippingAddress component if needed */}
                <ShippingAddress
                  customer={customer || null}
                  checked={sameAsBilling}
                  onChange={toggleSameAsBilling}
                  cart={cart}
                  translations={translations}
                  locale={locale}
                />

                {!sameAsBilling && (
                  <BillingAddress cart={cart} customer={customer || null} />
                )}

                {/* Checkbox label uses translation */}
                <label className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={toggleSameAsBilling}
                    className="mr-2"
                  />
                  {t('billingSameAsShipping')}
                </label>

                {/* Submit button uses translation */}
                <SubmitButton
                  className="mt-8"
                  isLoading={isPending}
                  isDisabled={isDisabled}
                >
                  {t('next')}
                </SubmitButton>
                <ErrorMessage error={data?.error} />
              </>
            )
          }}
        </Form>
      ) : null}
    </>
  )
}

export default Addresses
