import CheckoutCartScreen from "@components/checkout/CheckoutCartScreen";
import React from "react";

export const metadata = {
  title: "Carrito de compras | Crokete",
  description:
    "Revisa tu carrito de compras antes de proceder al pago.",
  keywords: ["carrito", "compras", "crokete"],
  openGraph: {
    title: "Carrito de compras | Crokete",
    description: "Revisa tu carrito de compras antes de proceder al pago.",
    url: "https://www.crokete.com.mx/checkout-cart",
    images: [
      {
        url: "https://www.crokete.com.mx/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Carrito de compras Crokete",
      },
    ],
  },
};

const CheckoutCart = async () => {
  return (
    <div className="">
      <CheckoutCartScreen />
    </div>
  );
};

export default CheckoutCart;
