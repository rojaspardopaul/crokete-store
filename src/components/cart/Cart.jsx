"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "react-use-cart";
import { IoBagCheckOutline, IoClose, IoBagHandle } from "react-icons/io5";

//internal import
import CartItem from "@components/cart/CartItem";
import { getUserSession } from "@lib/auth-client";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import WhatsAppButton from "@components/button/WhatsAppButton";
import LoyaltyCartBanner from "@components/loyalty/LoyaltyCartBanner";
import { useSetting } from "@context/SettingContext";

const Cart = ({ setOpen, currency }) => {
  const router = useRouter();
  const { isEmpty, items, cartTotal } = useCart();
  const { globalSetting } = useSetting();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const freeShippingThreshold = Number(globalSetting?.free_shipping_threshold) || 599;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
  const isFreeShipping = cartTotal >= freeShippingThreshold;

  const userInfo = getUserSession();

  const handleCheckout = () => {
    if (items?.length <= 0) {
      setOpen(false);
    } else {
      setCheckoutLoading(true);
      setOpen(false);
      if (!userInfo) {
        router.push(`/auth/login?redirectUrl=checkout`, { scroll: true });
      } else {
        router.push("/checkout", { scroll: true });
      }
    }
  };

  return (
    <>
      <div className="flex flex-col h-full justify-between items-middle bg-white rounded w-screen max-w-lg">
        <div className="w-full flex justify-between items-center relative px-5 py-4 border-b bg-indigo-50 border-gray-100">
          <h2 className="font-semibold  text-lg m-0 text-heading flex items-center">
            <FiShoppingCart
              aria-hidden="true"
              className="size-6 shrink-0 me-2"
            />
            Mi carrito
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex text-base items-center cursor-pointer justify-center text-gray-500 p-2 focus:outline-none transition-opacity hover:text-red-400"
          >
            <IoClose />
            <span className="font-sens text-sm text-gray-500 hover:text-red-400 ml-1">
              Cerrar
            </span>
          </button>
        </div>
        <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full p-4 lg:p-6">
          {isEmpty && (
            <div className="flex flex-col h-full justify-center">
              <div className="flex flex-col items-center">
                <Image
                  className="size-40 flex-none rounded-md object-cover"
                  src="/no-result.webp"
                  alt="no-result"
                  width={400}
                  height={380}
                />
                <h3 className=" font-semibold text-gray-700 text-lg pt-5">
                  Tu carrito está vacío.
                </h3>
                <p className="px-12 text-center text-sm text-gray-500 pt-2">
                  Agrega algunos productos a tu carrito para continuar.
                </p>
              </div>
            </div>
          )}

          {items.map((item, i) => (
            <CartItem key={i + 1} item={item} />
          ))}
        </div>
        <div className="bg-neutral-50 dark:bg-slate-900 p-5">
          {/* Free shipping progress bar */}
          {!isFreeShipping && !isEmpty && (
            <div className="mb-4 bg-amber-50 rounded-lg p-3">
              <p className="text-xs text-amber-800 font-medium mb-2">
                Agrega {currency}{remainingForFreeShipping.toFixed(2)} más para obtener <strong>envío gratis</strong>
              </p>
              <div className="w-full bg-amber-200 rounded-full h-1.5">
                <div
                  className="bg-kachabazar-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {isFreeShipping && !isEmpty && (
            <div className="mb-4 bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-700 font-medium">
                ✓ ¡Envío gratis aplicado!
              </p>
            </div>
          )}
          <p className="flex justify-between font-semibold text-slate-900 dark:text-slate-100">
            <span>Subtotal</span>
            <span>
              {currency}
              {cartTotal.toFixed(2)}
            </span>
          </p>

          {/* Loyalty points estimate */}
          <LoyaltyCartBanner cartTotal={cartTotal} compact={true} />

          <div className="flex space-x-3 mt-3">
            <Link
              href="/checkout-cart"
              prefetch={true}
              onClick={() => setOpen(false)}
              className="relative h-auto inline-flex items-center justify-center rounded-md transition-colors text-sm sm:text-base font-medium py-2 px-3 bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 flex-1 border border-slate-200 dark:border-slate-700 dark:focus:ring-offset-0 cursor-pointer"
            >
              Ver detalle de carrito
            </Link>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="relative h-auto inline-flex items-center justify-center gap-2 rounded-md transition-colors text-sm sm:text-base font-medium py-2 px-3 bg-kachabazar-500 hover:bg-kachabazar-600 border border-kachabazar-500 text-white flex-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Cargando...
                </>
              ) : (
                "Ir a pagar"
              )}
            </button>
          </div>

          {/* WhatsApp Order Button */}
          <div className="mt-3">
            <WhatsAppButton
              items={items}
              cartTotal={cartTotal}
              fullWidth={true}
            >
              Ordenar por WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
