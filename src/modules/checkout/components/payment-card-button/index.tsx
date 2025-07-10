"use client"

import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js"
import * as React from "react"
import { HttpTypes } from "@medusajs/types"

import { isStripe } from "@lib/constants"
import { Button } from "@/components/Button"
import { usePathname, useRouter } from "next/navigation"
import { useInitiatePaymentSession } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  cardComplete?: boolean
  createQueryString: (name: string, value: string) => string
  selectedPaymentMethod: string
  setError: (value: string | null) => void
}

const PaymentCardButton: React.FC<PaymentButtonProps> = ({
  cart,
  isLoading,
  setIsLoading,
  cardComplete,
  createQueryString,
  selectedPaymentMethod,
  setError,
}) => {
  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )
  if (isStripe(session?.provider_id) && isStripe(selectedPaymentMethod)) {
    return (
      <StripeCardPaymentButton
        setError={setError}
        cart={cart}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        cardComplete={cardComplete}
        createQueryString={createQueryString}
      />
    )
  }

  return (
    <PaymentMethodButton
      setError={setError}
      cart={cart}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      createQueryString={createQueryString}
      selectedPaymentMethod={selectedPaymentMethod}
    />
  )
}

const StripeCardPaymentButton = ({
  cart,
  isLoading,
  setIsLoading,
  cardComplete,
  createQueryString,
  setError,
}: {
  cart: HttpTypes.StoreCart
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  cardComplete?: boolean
  createQueryString: (name: string, value: string) => string
  setError: (value: string | null) => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const cardElement = elements?.getElement(CardElement)
  const router = useRouter()
  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )
  const pathname = usePathname()
  const initiatePaymentSession = useInitiatePaymentSession()

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // If no Stripe session, initiate it
      if (!isStripe(session?.provider_id)) {
        await initiatePaymentSession.mutateAsync({ providerId: "stripe" })
      }
      // Find the updated session after initiation
      const updatedSession = cart.payment_collection?.payment_sessions?.find(
        (s) => s.provider_id === "stripe"
      )
      // Get the client_secret from the payment session
      const clientSecret = updatedSession?.data?.client_secret
      // Debug logs for troubleshooting Stripe integration
      console.log("[Stripe Debug] stripe:", stripe)
      console.log("[Stripe Debug] elements:", elements)
      console.log("[Stripe Debug] cardElement:", cardElement)
      console.log("[Stripe Debug] clientSecret:", clientSecret, typeof clientSecret)
      if (
        !stripe ||
        !elements ||
        !cardElement ||
        typeof clientSecret !== "string" ||
        !clientSecret
      ) {
        setError("Stripe is not properly initialized, client_secret, or card element missing.")
        return
      }
      // Confirm the card payment using Stripe.js
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
          },
        },
      })
      if (result.error) {
        setError(result.error.message || "Payment failed.")
        return
      }
      // On success, move to review step
      return router.push(
        pathname + "?" + createQueryString("step", "review"),
        {
          scroll: false,
        }
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : `${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      className="mt-6"
      onPress={handleSubmit}
      isLoading={isLoading}
      isDisabled={!cardComplete}
      data-testid="submit-payment-button"
    >
      {session ? "Continue to review" : "Enter card details"}
    </Button>
  )
}

const PaymentMethodButton = ({
  isLoading,
  setIsLoading,
  createQueryString,
  selectedPaymentMethod,
  setError,
}: {
  cart: HttpTypes.StoreCart
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  createQueryString: (name: string, value: string) => string
  selectedPaymentMethod: string
  setError: (value: string | null) => void
}) => {
  const router = useRouter()
  const pathname = usePathname()

  const initiatePaymentSession = useInitiatePaymentSession()

  const handleSubmit = () => {
    setIsLoading(true)
    initiatePaymentSession.mutate(
      {
        providerId: selectedPaymentMethod,
      },
      {
        onSuccess: () => {
          if (!isStripe(selectedPaymentMethod)) {
            return router.push(
              pathname + "?" + createQueryString("step", "review"),
              {
                scroll: false,
              }
            )
          }
          setIsLoading(false)
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : `${err}`)
          setIsLoading(false)
        },
      }
    )
  }

  return (
    <Button
      className="mt-6"
      onPress={handleSubmit}
      isLoading={isLoading}
      data-testid="submit-payment-button"
      isDisabled={!selectedPaymentMethod}
    >
      {isStripe(selectedPaymentMethod)
        ? "Enter card details"
        : ""}
    </Button>
  )
}

export default withReactQueryProvider(PaymentCardButton)
