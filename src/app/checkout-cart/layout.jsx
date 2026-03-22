"use client";

import { Elements } from "@stripe/react-stripe-js";

/**
 * Checkout-cart layout — provides a lightweight Stripe Elements context
 * WITHOUT loading Stripe.js (~50KB + network latency).
 *
 * useCheckoutSubmit() calls useStripe() unconditionally, so an <Elements>
 * wrapper is needed. Passing stripe={null} satisfies the context but skips
 * the heavy loadStripe() call — the cart page never processes payments.
 */
export default function CheckoutCartLayout({ children }) {
  return <Elements stripe={null}>{children}</Elements>;
}
