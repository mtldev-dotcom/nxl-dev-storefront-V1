// Translation keys for the Billing Address form
export interface BillingAddressTranslations {
    heading: string
    firstName: string
    lastName: string
    company: string
    address: string
    address2: string
    city: string
    postalCode: string
    stateProvince: string
    country: string
    phone: string
    next: string
    back: string
    billingSameAsShipping: string
}

// Translation keys for the Shipping step
export interface ShippingStepTranslations {
    heading: string
    standardShipping: string
    expressShipping: string
    next: string
    back: string
}

// Translation keys for the Payment step
export interface PaymentStepTranslations {
    heading: string
    cardNumber: string
    nameOnCard: string
    expiry: string
    cvc: string
    pay: string
    back: string
}

// Translation keys for the Review step
export interface ReviewStepTranslations {
    heading: string
    placeOrder: string
    back: string
}

// Translation keys for the Order Summary
export interface OrderSummaryTranslations {
    order: string
    editCart: string
    subtotal: string
    shipping: string
    taxes: string
    total: string
    discountCode: string
    apply: string
    variant: string
    quantity: string
} 