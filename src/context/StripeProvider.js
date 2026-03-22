"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo } from "react";
import { useSetting } from "@context/SettingContext";

/**
 * StripeProvider — wraps only checkout pages with Stripe Elements.
 * The Stripe public key comes exclusively from the backend API
 * (storeSetting.stripe_key) to guarantee it matches the secret key
 * the backend uses to create PaymentIntents.
 */
const StripeProvider = ({ children }) => {
  const { storeSetting } = useSetting();

  const stripePromise = useMemo(() => {
    const key = storeSetting?.stripe_key;
    if (
      !key ||
      key === "your_stripe_api_key" ||
      (key.startsWith("pk_live_") &&
        typeof window !== "undefined" &&
        window.location.protocol !== "https:")
    ) {
      return null;
    }
    return loadStripe(key);
  }, [storeSetting?.stripe_key]);

  if (!stripePromise) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Método de pago con tarjeta no disponible.</p>
        <p className="text-sm text-gray-500 mt-1">
          Stripe no está configurado. Contacta al administrador.
        </p>
      </div>
    );
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProvider;
