"use client";

import React, { useEffect, useState } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import Link from "next/link";
import {
  IoReturnUpBackOutline,
  IoArrowForward,
  IoBagHandle,
  IoWalletSharp,
} from "react-icons/io5";
import { ImCreditCard } from "react-icons/im";
import { FiTruck, FiTag, FiGift } from "react-icons/fi";

//internal import
import Label from "@components/form/Label";
import Error from "@components/form/Error";
import CartItem from "@components/cart/CartItem";
import InputArea from "@components/form/InputArea";
import InputShipping from "@components/form/InputShipping";
import InputPayment from "@components/form/InputPayment";
import useCheckoutSubmit from "@hooks/useCheckoutSubmit";
import usePostalCodeLookup from "@hooks/usePostalCodeLookup";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import SwitchToggle from "@components/form/SwitchToggle";
import LoyaltyCartBanner from "@components/loyalty/LoyaltyCartBanner";
import SecurePaymentBadge from "@components/checkout/SecurePaymentBadge";

const CheckoutForm = ({ shippingAddress, hasShippingAddress }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const {
    error,
    stripe,
    couponInfo,
    couponRef,
    total,
    isEmpty,
    items,
    cartTotal,
    currency,
    register,
    errors,
    showCard,
    setShowCard,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    handleCouponCode,
    discountAmount,
    productDiscount,
    shippingCost,
    isFreeShipping,
    isCheckoutSubmit,
    useExistingAddress,
    isCouponAvailable,
    globalSetting,
    storeSetting,
    storeCustomization,
    showingTranslateValue,
    handleDefaultShippingAddress,
    setValue,
    watch,
  } = useCheckoutSubmit({ shippingAddress });
  const checkout = storeCustomization?.checkout;

  // CP lookup integration
  const watchedPostalCode = watch("postalCode", "");
  const { colonias, municipio, loading: cpLoading, error: cpError } = usePostalCodeLookup(watchedPostalCode);

  // Auto-fill municipio when CP lookup returns data
  useEffect(() => {
    if (municipio) {
      setValue("municipio", municipio);
    }
  }, [municipio, setValue]);

  // Auto-select colonia when only one option
  useEffect(() => {
    if (colonias.length === 1) {
      setValue("colonia", colonias[0]);
    }
  }, [colonias, setValue]);
  if (!mounted) return null; // or a skeleton loader

  return isEmpty ? (
    <div className="py-20 flex flex-col items-center justify-center text-center">
      <span className="text-gray-400 text-6xl mb-4">
        <IoBagHandle />
      </span>
      <h2 className="font-semibold text-xl text-gray-700 mb-2">
        Tu carrito está vacío
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        No puedes finalizar la compra sin productos en tu carrito.
      </p>
      <Link
        href="/search"
        className="inline-flex items-center gap-2 px-6 py-3 bg-kachabazar-500 hover:bg-kachabazar-600 text-white font-medium rounded-md transition-colors"
      >
        <IoReturnUpBackOutline className="text-xl" />
        Ir a comprar
      </Link>
    </div>
  ) : (
    <div className="py-10 lg:py-12 px-0 2xl:max-w-screen-2xl w-full xl:max-w-screen-xl flex flex-col md:flex-row lg:flex-row">
      {/* checkout form */}
      <div className="md:w-full lg:w-3/5 flex h-full flex-col order-2 sm:order-1 lg:order-1">
        <div className="mt-5 md:mt-0 md:col-span-2">
          {/* <Elements stripe={stripePromise}> */}
          <form onSubmit={handleSubmit(submitHandler)}>
            {hasShippingAddress && (
              <div className="flex justify-end my-2">
                <SwitchToggle
                  id="shipping-address"
                  title="Usar Dirección de Envío Predeterminada"
                  processOption={useExistingAddress}
                  handleProcess={handleDefaultShippingAddress}
                />
              </div>
            )}
            <div className="form-group">
              <h2 className="font-semibold text-base text-gray-700 pb-3">
                01. {showingTranslateValue(checkout?.personal_details)}
              </h2>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <InputArea
                    register={register}
                    label={showingTranslateValue(checkout?.first_name)}
                    name="firstName"
                    type="text"
                    placeholder="John"
                  />
                  <Error errorMessage={errors.firstName} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <InputArea
                    register={register}
                    label={showingTranslateValue(checkout?.last_name)}
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                  />
                  <Error errorMessage={errors.lastName} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <InputArea
                    register={register}
                    label={showingTranslateValue(checkout?.email_address)}
                    name="email"
                    type="email"
                    placeholder="youremail@gmail.com"
                  />
                  <Error errorMessage={errors.email} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <InputArea
                    register={register}
                    label={showingTranslateValue(checkout?.checkout_phone)}
                    name="contact"
                    type="tel"
                    placeholder="+062-6532956"
                  />

                  <Error errorMessage={errors.contact} />
                </div>
              </div>
            </div>

            <div className="form-group mt-12">
              <h2 className="font-semibold text-base text-gray-700 pb-3">
                02. Dirección de Envío
              </h2>

              <div className="grid grid-cols-6 gap-6 mb-8">
                {/* Código Postal */}
                <div className="col-span-6 sm:col-span-2">
                  <InputArea
                    register={register}
                    label="Código Postal"
                    name="postalCode"
                    type="text"
                    placeholder="44100"
                  />
                  {cpLoading && (
                    <p className="text-xs text-blue-500 mt-1">Buscando código postal...</p>
                  )}
                  {cpError && (
                    <p className="text-xs text-red-500 mt-1">{cpError}</p>
                  )}
                  <Error errorMessage={errors.postalCode} />
                </div>

                {/* Colonia */}
                <div className="col-span-6 sm:col-span-4">
                  <Label label="Colonia" />
                  {colonias.length > 1 ? (
                    <div className="relative">
                      <select
                        {...register("colonia", { required: "La colonia es requerida" })}
                        className="w-full py-2 px-4 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-kachabazar-500 bg-white appearance-none pr-8"
                      >
                        <option value="">Seleccione una colonia</option>
                        {colonias.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <Input
                      {...register("colonia", { required: "Colonia es requerida" })}
                      type="text"
                      placeholder="Colonia"
                      className="py-2 px-4 md:px-5"
                    />
                  )}
                  <Error errorMessage={errors.colonia} />
                </div>

                {/* Calle */}
                <div className="col-span-6">
                  <InputArea
                    register={register}
                    label="Calle"
                    name="calle"
                    type="text"
                    placeholder="Av. Vallarta"
                  />
                  <Error errorMessage={errors.calle} />
                </div>

                {/* Núm Exterior */}
                <div className="col-span-3 sm:col-span-2">
                  <InputArea
                    register={register}
                    label="Núm. Exterior"
                    name="numExterior"
                    type="text"
                    placeholder="123"
                  />
                  <Error errorMessage={errors.numExterior} />
                </div>

                {/* Núm Interior */}
                <div className="col-span-3 sm:col-span-2">
                  <Label label="Núm. Interior (opcional)" />
                  <Input
                    {...register("numInterior")}
                    type="text"
                    placeholder="4A"
                    className="py-2 px-4 md:px-5"
                  />
                </div>

                {/* Municipio */}
                <div className="col-span-6 sm:col-span-2">
                  <InputArea
                    register={register}
                    label="Municipio"
                    name="municipio"
                    type="text"
                    placeholder="Guadalajara"
                    disabled={!!municipio}
                  />
                  <Error errorMessage={errors.municipio} />
                </div>

                {/* Referencias */}
                <div className="col-span-6">
                  <Label label="Referencias (opcional)" />
                  <Input
                    {...register("referencias")}
                    type="text"
                    placeholder="Entre calle X y calle Y, casa color azul"
                    className="py-2 px-4 md:px-5"
                  />
                </div>
              </div>

              <Label label={showingTranslateValue(checkout?.shipping_cost) || "Costo de Envío"} />
              <div className="grid grid-cols-6 gap-6">
                {isFreeShipping ? (
                  <div className="col-span-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <FiTruck className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800 text-sm">¡Envío gratis!</p>
                      <p className="text-xs text-green-600">Tu compra califica para envío gratuito</p>
                    </div>
                    <span className="ml-auto font-bold text-green-700">GRATIS</span>
                  </div>
                ) : (
                  <>
                    <div className="col-span-6 sm:col-span-3">
                      <InputShipping
                        currency={currency}
                        register={register}
                        handleShippingCost={handleShippingCost}
                        name={showingTranslateValue(checkout?.shipping_name_one) || "Envío Estándar"}
                        description={showingTranslateValue(
                          checkout?.shipping_one_desc
                        ) || "Entrega en 3-5 días - "}
                        value={Number(checkout?.shipping_one_cost) || 60}
                      />
                      <Error errorMessage={errors.shippingOption} />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <InputShipping
                        currency={currency}
                        register={register}
                        handleShippingCost={handleShippingCost}
                        name={showingTranslateValue(checkout?.shipping_name_two) || "Envío Express"}
                        description={showingTranslateValue(
                          checkout?.shipping_two_desc
                        ) || "Entrega en 1-2 días - "}
                        value={Number(checkout?.shipping_two_cost) || 20}
                      />
                      <Error errorMessage={errors.shippingOption} />
                    </div>
                    <div className="col-span-6">
                      <p className="text-xs text-gray-500">
                        <FiTruck className="inline w-3 h-3 mr-1" />
                        Agrega {currency}{Math.max(0, (Number(globalSetting?.free_shipping_threshold) || 599) - cartTotal).toFixed(2)} más para obtener envío gratis
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="form-group mt-12">
              <h2 className="font-semibold text-base text-gray-700 pb-3">
                03. {showingTranslateValue(checkout?.payment_method)}
              </h2>
              {showCard && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Datos de tu tarjeta
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3.5 bg-white focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#374151",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            "::placeholder": {
                              color: "#9CA3AF",
                            },
                          },
                          invalid: {
                            color: "#EF4444",
                            iconColor: "#EF4444",
                          },
                        },
                        hidePostalCode: true,
                      }}
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </p>
                  )}
                  <SecurePaymentBadge />
                </div>
              )}
              <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
                {storeSetting?.cod_status && (
                  <div className="">
                    <InputPayment
                      setShowCard={setShowCard}
                      register={register}
                      name="Pago Contra Entrega"
                      value="Cash"
                      Icon={IoWalletSharp}
                    />
                    <Error errorMessage={errors.paymentMethod} />
                  </div>
                )}

                {storeSetting?.stripe_status && (
                  <div className="">
                    <InputPayment
                      setShowCard={setShowCard}
                      register={register}
                      name="Tarjeta de Crédito"
                      value="Card"
                      Icon={ImCreditCard}
                    />
                    <Error errorMessage={errors.paymentMethod} />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4 lg:gap-6 mt-10">
              <div className="col-span-6 sm:col-span-3">
                <Link
                  href="/search"
                  className="w-full h-10 rounded-sm inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors border border-gray-200"
                >
                  <IoReturnUpBackOutline className="text-xl" />
                  Continuar Comprando
                </Link>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <Button
                  type="submit"
                  variant="create"
                  disabled={isEmpty || isCheckoutSubmit || (showCard && !stripe)}
                  isLoading={isCheckoutSubmit}
                  className="w-full h-10 rounded-sm"
                >
                  {isCheckoutSubmit ? (
                    showCard ? "Procesando pago seguro..." : "Procesando"
                  ) : (
                    <span className="flex justify-center text-center">
                      Confirmar Pedido
                      <span className="text-xl ml-2">
                        {" "}
                        <IoArrowForward />
                      </span>
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
          {/* </Elements> */}
        </div>
      </div>

      {/* cart section */}
      <div className="md:w-full lg:w-2/5 lg:ml-10 xl:ml-14 md:ml-6 flex flex-col h-full md:sticky lg:sticky top-44 md:order-2 lg:order-2">
        <div className="border p-5 lg:px-8 lg:py-8 rounded-lg bg-white order-1 sm:order-2">
          <h2 className="font-semibold text-lg pb-4">
            Resumen de tu pedido
          </h2>

          <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-64 bg-gray-50 rounded-lg block">
            {items.map((item) => (
              <CartItem key={item.id} item={item} currency={currency} />
            ))}

            {isEmpty && (
              <div className="text-center py-10">
                <span className="flex justify-center my-auto text-gray-500 font-semibold text-4xl">
                  <IoBagHandle />
                </span>
                <h2 className="font-medium text-sm pt-2 text-gray-600">
                  No hay productos en el carrito.
                </h2>
              </div>
            )}
          </div>

          {/* Coupon input */}
          <div className="mt-4 py-4 text-sm w-full font-semibold">
            {couponInfo.couponCode ? (
              <span className="bg-kachabazar-50 px-4 py-3 leading-tight w-full rounded-md flex justify-between">
                <p className="text-kachabazar-600">Cupón Aplicado</p>
                <span className="text-red-500 text-right">
                  {couponInfo.couponCode}
                </span>
              </span>
            ) : (
              <div className="flex flex-row items-start justify-end">
                <Input
                  ref={couponRef}
                  type="text"
                  placeholder="Código de descuento"
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

          {/* Summary lines */}
          <div className="space-y-2 text-sm">
            {/* Subtotal */}
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800">
                {currency}{(items?.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0) || 0).toFixed(2)}
              </span>
            </div>

            {/* Product discounts */}
            {productDiscount > 0 && (
              <div className="flex justify-between text-orange-600">
                <span className="flex items-center gap-1">
                  <FiTag className="w-3.5 h-3.5" />
                  Descuento productos
                </span>
                <span className="font-semibold">
                  -{currency}{productDiscount.toFixed(2)}
                </span>
              </div>
            )}

            {/* Coupon discount */}
            {discountAmount > 0 && (
              <div className="flex justify-between text-orange-600">
                <span className="flex items-center gap-1">
                  <FiGift className="w-3.5 h-3.5" />
                  Cupón/Recompensa
                </span>
                <span className="font-semibold">
                  -{currency}{discountAmount.toFixed(2)}
                </span>
              </div>
            )}

            {/* Shipping */}
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-1">
                <FiTruck className="w-3.5 h-3.5" />
                Envío
              </span>
              {isFreeShipping ? (
                <span className="font-bold text-kachabazar-600">GRATIS</span>
              ) : (
                <span className="font-semibold text-gray-800">
                  {currency}{shippingCost?.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* IVA desglosado */}
          <div className="flex justify-between text-gray-500 text-xs pt-1">
            <span>IVA (16%) incluido</span>
            <span>{currency}{(parseFloat(total) * 16 / 116).toFixed(2)}</span>
          </div>

          {/* Total */}
          <div className="border-t mt-4">
            <div className="flex items-center font-bold justify-between pt-4 text-sm uppercase">
              Total
              <span className="font-extrabold text-lg">
                {currency}{parseFloat(total).toFixed(2)}
              </span>
            </div>
            {/* Loyalty points estimate */}
            <div className="mt-3">
              <LoyaltyCartBanner cartTotal={parseFloat(total)} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
