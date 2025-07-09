// Translation interfaces for all checkout steps

export interface CheckoutDeliveryTranslations {
    stepDelivery: string
    firstName: string
    lastName: string
    address: string
    company: string
    postalCode: string
    city: string
    country: string
    stateProvince: string
    phone: string
    billingSameAsShipping: string
    next: string
}

export interface CheckoutShippingTranslations {
    stepShipping: string
    noShippingMethods: string
    shipping: string
    change: string
    next: string
}

export interface CheckoutPaymentTranslations {
    stepPayment: string
    paymentMethods: string
    cardNumber: string
    removeCard: string
    failedRemoveCard: string
    next: string
    change: string
}

export interface CheckoutReviewTranslations {
    stepReview: string
    view: string
    placeOrder: string
    confirmText: string
} 