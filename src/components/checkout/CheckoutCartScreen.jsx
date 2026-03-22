"use client";

import React from "react";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { FiTruck, FiTag, FiGift } from "react-icons/fi";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";

//internal import

import CartItem from "@components/cart/CartItem";
import useCheckoutSubmit from "@hooks/useCheckoutSubmit";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import WhatsAppButton from "@components/button/WhatsAppButton";

const CheckoutCartScreen = () => {
  const { showingTranslateValue } = useUtilsFunction();

  const {
    total,
    isEmpty,
    items,
    cartTotal,
    couponInfo,
    couponRef,
    handleCouponCode,
    discountAmount,
    productDiscount,
    isFreeShipping,
    isCouponAvailable,
    globalSetting,
    storeCustomization,
    currency,
  } = useCheckoutSubmit({});

  const checkout = storeCustomization?.checkout;
  const freeShippingThreshold = Number(globalSetting?.free_shipping_threshold) || 599;
  const totalDiscount = productDiscount + discountAmount;

  // Subtotal based on original prices (before product discounts)
  const originalSubtotal = items?.reduce((acc, item) => {
    const orig = item.originalPrice || item.price;
    return acc + orig * item.quantity;
  }, 0) || 0;

  // How much more the user needs for free shipping
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 pt-16 pb-16">
      <div className="flex flex-col lg:flex-row">
        {/* Cart items */}
        <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200">
          <h2 className="font-bold text-xl pb-3">Carrito de compras</h2>
          <div className="w-full block mt-3">
            {items.map((item) => (
              <CartItem key={item.id} item={item} currency={currency} />
            ))}

            {isEmpty && (
              <div className="mt-10 flex flex-col h-full justify-center">
                <div className="flex flex-col items-center">
                  <Image
                    className="size-40 flex-none rounded-md object-cover"
                    src="/no-result.svg"
                    alt="no-result"
                    width={400}
                    height={380}
                  />
                  <h3 className="font-semibold text-gray-700 text-lg pt-5">
                    Tu carrito está vacío
                  </h3>
                  <p className="px-12 text-center text-sm text-gray-500 pt-2">
                    No hay artículos agregados en tu carrito. Por favor agrega productos a tu lista de carrito.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t lg:border-t-0 lg:border-l border-gray-200 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>

        {/* Order summary sidebar */}
        <div className="flex-1">
          <div className="sticky top-44 border bg-white rounded-lg border-gray-100">
            <div className="p-6 sm:p-8">
              <h2 className="font-semibold text-lg mb-4">
                Resumen de tu pedido
              </h2>

              {/* Free shipping progress bar */}
              {!isFreeShipping && !isEmpty && (
                <div className="mb-5 bg-amber-50 rounded-lg p-3">
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

              <div className="space-y-3 text-sm">
                {/* Subtotal (original prices) */}
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {currency}{originalSubtotal.toFixed(2)}
                  </span>
                </div>

                {/* Product discounts */}
                {productDiscount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span className="flex items-center gap-1">
                      <FiTag className="w-3.5 h-3.5" />
                      Descuento en productos
                    </span>
                    <span className="font-semibold">
                      -{currency}{productDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Coupon / Rewards discount */}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span className="flex items-center gap-1">
                      <FiGift className="w-3.5 h-3.5" />
                      {couponInfo.couponCode ? `Cupón: ${couponInfo.couponCode}` : "Recompensa"}
                    </span>
                    <span className="font-semibold">
                      -{currency}{discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Delivery */}
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <FiTruck className="w-3.5 h-3.5" />
                    Entrega
                  </span>
                  {isFreeShipping ? (
                    <span className="font-bold text-kachabazar-600">GRATIS</span>
                  ) : (
                    <span className="text-gray-500 text-xs">Se calcula al finalizar</span>
                  )}
                </div>
              </div>

              {/* Divider + Total */}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-base text-gray-900">Total</span>
                  <span className="font-extrabold text-xl text-gray-900">
                    {currency}{parseFloat(cartTotal).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Los precios incluyen IVA.
                </p>
              </div>

              {/* Coupon input */}
              <div className="mt-5">
                {couponInfo.couponCode ? (
                  <span className="bg-kachabazar-50 px-4 py-3 leading-tight w-full rounded-md flex justify-between">
                    <p className="text-kachabazar-600">Cupón Aplicado</p>
                    <span className="text-red-500 text-right font-semibold">
                      {couponInfo.couponCode}
                    </span>
                  </span>
                ) : (
                  <div className="flex flex-row items-start justify-end w-full">
                    <Input
                      ref={couponRef}
                      type="text"
                      placeholder="Código de Cupón"
                      className="px-4 py-2 h-10 mr-1 border border-gray-300 rounded-md focus:outline-none"
                    />
                    <Button
                      onClick={handleCouponCode}
                      className="h-10 rounded-sm"
                      variant="create"
                    >
                      {showingTranslateValue(checkout?.apply_button)}
                    </Button>
                  </div>
                )}
              </div>

              {/* Active promotions */}
              <div className="mt-5 bg-green-50 rounded-lg p-4 space-y-2">
                <h3 className="text-xs font-bold text-green-800 uppercase tracking-wide flex items-center gap-1">
                  <FiGift className="w-3.5 h-3.5" />
                  Promociones
                </h3>
                {isFreeShipping && (
                  <p className="text-xs text-green-700 flex items-center gap-1.5">
                    <FiTruck className="w-3.5 h-3.5 text-green-600" />
                    Envío gratis en compras mayores a {currency}{freeShippingThreshold}
                  </p>
                )}
                {productDiscount > 0 && (
                  <p className="text-xs text-green-700 flex items-center gap-1.5">
                    <FiTag className="w-3.5 h-3.5 text-green-600" />
                    Descuento en productos seleccionados: -{currency}{productDiscount.toFixed(2)}
                  </p>
                )}
                {discountAmount > 0 && (
                  <p className="text-xs text-green-700 flex items-center gap-1.5">
                    <FiTag className="w-3.5 h-3.5 text-green-600" />
                    Cupón/Recompensa aplicada: -{currency}{discountAmount.toFixed(2)}
                  </p>
                )}
                {!isFreeShipping && productDiscount === 0 && discountAmount === 0 && (
                  <p className="text-xs text-gray-500">
                    Agrega {currency}{remainingForFreeShipping.toFixed(2)} más para envío gratis
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-neutral-50 p-6 sm:p-8 rounded-b-lg">
              <div className="flex space-x-3 items-center">
                <Link
                  href="/search"
                  className="relative h-auto inline-flex items-center justify-center rounded-md transition-colors text-xs sm:text-base font-medium py-2.5 px-3 bg-white text-slate-700 hover:bg-gray-100 flex-1 border border-slate-200"
                >
                  <span className="text-xl mr-2">
                    <IoReturnUpBackOutline />
                  </span>
                  Seguir comprando
                </Link>
                <Link
                  href="/checkout"
                  className="relative h-auto inline-flex items-center justify-center rounded-md w-full transition-colors text-xs sm:text-base font-medium py-2.5 px-3 bg-kachabazar-500 hover:bg-kachabazar-600 border border-kachabazar-500 text-white flex-1"
                >
                  Finalizar Compra
                </Link>
              </div>
              
              {/* WhatsApp Order Button */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  <span className="font-medium">O compra más rápido por WhatsApp</span>
                </p>
                <WhatsAppButton
                  items={items}
                  cartTotal={parseFloat(total)}
                  fullWidth={true}
                  size="lg"
                >
                  Completar compra por WhatsApp
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CheckoutCartScreen), {
  ssr: false,
});
