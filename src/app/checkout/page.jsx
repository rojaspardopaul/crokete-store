//internal import

import CheckoutForm from "@components/checkout/CheckoutForm";
import { getShippingAddress } from "@services/CustomerServices";

export const metadata = {
  title: "Pago | Crokete",
  description:
    "Completa tu compra de forma segura y rápida.",
  keywords: ["pago", "checkout", "envío", "pedido"],
  openGraph: {
    title: "Pago | Crokete",
    description: "Completa tu compra de forma segura y rápida.",
    url: "https://www.crokete.com.mx/checkout",
    images: [
      {
        url: "https://www.crokete.com.mx/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Pago Crokete",
      },
    ],
  },
};

const Checkout = async () => {
  const { shippingAddress, error: shippingError } = await getShippingAddress({
    id: "",
  });
  // console.log("shippingAddress", shippingAddress);

  const hasShippingAddress =
    shippingAddress && Object.keys(shippingAddress).length > 0;

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      <CheckoutForm
        shippingAddress={shippingAddress}
        hasShippingAddress={hasShippingAddress}
      />
    </div>
  );
};

export default Checkout;
