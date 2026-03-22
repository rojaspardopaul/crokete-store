import StripeProvider from "@context/StripeProvider";

/**
 * Checkout layout — wraps checkout pages with Stripe Elements provider.
 * This isolates Stripe SDK loading to only checkout pages instead of the entire app.
 */
export default function CheckoutLayout({ children }) {
  return <StripeProvider>{children}</StripeProvider>;
}
