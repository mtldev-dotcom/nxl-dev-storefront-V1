"use client"

import { loadStripe } from "@stripe/stripe-js"
import * as React from "react"
import StripeWrapper from "@modules/checkout/components/payment-wrapper/stripe-wrapper"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { createContext } from "react"
import { isPaypal, isStripe } from "@lib/constants"
import { withReactQueryProvider } from "@lib/util/react-query"
import { StoreCart } from "@medusajs/types"

type WrapperProps = {
  children: React.ReactNode
  cart: StoreCart
}

export const StripeContext = createContext(false)

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

// IMPORTANT: This Wrapper ensures that all payment components (Stripe, PayPal, etc.)
// are wrapped in the correct provider context. For Stripe, it wraps children in <Elements>
// via StripeWrapper. Any component using useStripe() or Stripe UI elements MUST be a child
// of this Wrapper, or you will get a runtime error ("Could not find Elements context").
// Do NOT render payment forms outside this Wrapper (e.g., in modals/portals outside the tree).
const Wrapper: React.FC<WrapperProps> = ({ children, cart }) => {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  if (
    isStripe(paymentSession?.provider_id) &&
    paymentSession &&
    stripePromise
  ) {
    return (
      <StripeContext.Provider value={true}>
        <StripeWrapper
          paymentSession={paymentSession}
          stripeKey={stripeKey}
          stripePromise={stripePromise}
        >
          {children}
        </StripeWrapper>
      </StripeContext.Provider>
    )
  }

  if (
    isPaypal(paymentSession?.provider_id) &&
    paypalClientId !== undefined &&
    cart
  ) {
    return (
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
          currency: cart?.currency_code.toUpperCase(),
          intent: "authorize",
          components: "buttons",
        }}
      >
        {children}
      </PayPalScriptProvider>
    )
  }

  return <div>{children}</div>
}

export default withReactQueryProvider(Wrapper)
