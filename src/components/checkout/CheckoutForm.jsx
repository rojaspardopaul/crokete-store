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
import { FiTruck, FiTag, FiGift, FiUser, FiMapPin, FiCheckCircle } from "react-icons/fi";

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

const STEPS = [
  { id: 1, label: "Datos", fullLabel: "Datos personales", Icon: FiUser },
  { id: 2, label: "Dirección", fullLabel: "Dirección de Envío", Icon: FiMapPin },
  { id: 3, label: "Envío", fullLabel: "Costo de Envío", Icon: FiTruck },
  { id: 4, label: "Pago", fullLabel: "Método de Pago", Icon: ImCreditCard },
];

const StepIndicator = ({ current, maxReached, onStepClick }) => (
  <div className="flex items-center w-full mb-8 px-1">
    {STEPS.map((step, idx) => {
      const done = current > step.id;
      const active = current === step.id;
      const clickable = step.id <= maxReached && step.id !== current;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center min-w-0">
            <div
              onClick={() => clickable && onStepClick(step.id)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-all flex-shrink-0 ${
                clickable ? "cursor-pointer hover:opacity-75" : ""
              } ${
                done
                  ? "bg-kachabazar-500 border-kachabazar-500 text-white"
                  : active
                  ? "border-kachabazar-500 text-kachabazar-500 bg-white"
                  : "border-gray-300 text-gray-400 bg-white"
              }`}
            >
              {done ? <FiCheckCircle className="w-4 h-4" /> : step.id}
            </div>
            <span
              className={`text-[9px] sm:text-xs mt-0.5 sm:mt-1 font-medium leading-tight text-center ${
                active ? "text-kachabazar-600" : done ? "text-kachabazar-500" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-1 sm:mx-2 mb-5 sm:mb-4 transition-all ${
                current > step.id ? "bg-kachabazar-500" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const CheckoutForm = ({ shippingAddress, hasShippingAddress }) => {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);
  const [autoAdvanceDone, setAutoAdvanceDone] = useState(false);

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
    trigger,
  } = useCheckoutSubmit({ shippingAddress });

  const checkout = storeCustomization?.checkout;
  const freeShippingThreshold = Number(globalSetting?.free_shipping_threshold) || 599;

  const watchedPostalCode = watch("postalCode", "");
  const { colonias, municipio, loading: cpLoading, error: cpError } = usePostalCodeLookup(watchedPostalCode);

  useEffect(() => {
    if (municipio) setValue("municipio", municipio);
  }, [municipio, setValue]);

  useEffect(() => {
    if (colonias.length === 1) setValue("colonia", colonias[0]);
  }, [colonias, setValue]);

  // Auto-advance on initial load when the user already has a saved address
  useEffect(() => {
    if (autoAdvanceDone || !mounted || currentStep !== 1) return;
    if (!useExistingAddress) return;
    setAutoAdvanceDone(true);
    const target = isFreeShipping ? 4 : 3;
    setCurrentStep(target);
    setMaxReachedStep(target);
  }, [useExistingAddress, mounted, autoAdvanceDone, currentStep, isFreeShipping]);

  if (!mounted) return null;

  const stepFields = {
    1: ["firstName", "lastName", "email", "contact"],
    2: ["postalCode", "colonia", "calle", "numExterior", "municipio"],
    3: [],
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    setMaxReachedStep((prev) => Math.max(prev, step));
  };

  const handleNext = async () => {
    const fields = stepFields[currentStep] ?? [];

    if (currentStep === 2 && useExistingAddress) {
      goToStep(3);
      return;
    }

    if (currentStep === 3 && !isFreeShipping) {
      const shippingVal = watch("shippingOption");
      if (!shippingVal) {
        await trigger(["shippingOption"]);
        return;
      }
      goToStep(4);
      return;
    }

    const valid = fields.length === 0 || (await trigger(fields));
    if (valid) goToStep(currentStep + 1);
  };

  const handleBack = () => setCurrentStep((s) => Math.max(1, s - 1));

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
      {/* Checkout form */}
      <div className="md:w-full lg:w-3/5 flex h-full flex-col order-2 sm:order-1 lg:order-1">
        <div className="mt-5 md:mt-0 md:col-span-2">
          <StepIndicator
            current={currentStep}
            maxReached={maxReachedStep}
            onStepClick={setCurrentStep}
          />

          <form onSubmit={handleSubmit(submitHandler)}>
            {/* ── STEP 1: Datos personales ── */}
            {currentStep === 1 && (
              <div className="form-group animate-in fade-in duration-200">
                <h2 className="font-semibold text-base text-gray-700 pb-3">
                  {showingTranslateValue(checkout?.personal_details) || "Datos personales"}
                </h2>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={showingTranslateValue(checkout?.first_name) || "Nombre"}
                      name="firstName"
                      type="text"
                      placeholder="Juan"
                    />
                    <Error errorMessage={errors.firstName} />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={showingTranslateValue(checkout?.last_name) || "Apellido"}
                      name="lastName"
                      type="text"
                      placeholder="Pérez"
                    />
                    <Error errorMessage={errors.lastName} />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={showingTranslateValue(checkout?.email_address) || "Correo electrónico"}
                      name="email"
                      type="email"
                      placeholder="tucorreo@gmail.com"
                    />
                    <Error errorMessage={errors.email} />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={showingTranslateValue(checkout?.checkout_phone) || "Teléfono"}
                      name="contact"
                      type="tel"
                      placeholder="+52 33 1234 5678"
                    />
                    <Error errorMessage={errors.contact} />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Dirección de envío ── */}
            {currentStep === 2 && (
              <div className="form-group animate-in fade-in duration-200">
                <h2 className="font-semibold text-base text-gray-700 pb-3">
                  Dirección de Envío
                </h2>

                {hasShippingAddress && (
                  <div className="flex justify-end mb-4">
                    <SwitchToggle
                      id="shipping-address"
                      title="Usar Dirección de Envío Predeterminada"
                      processOption={useExistingAddress}
                      handleProcess={handleDefaultShippingAddress}
                    />
                  </div>
                )}

                {!useExistingAddress && (
                  <div className="grid grid-cols-6 gap-6 mb-4">
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

                    <div className="col-span-3 sm:col-span-2">
                      <Label label="Núm. Interior (opcional)" />
                      <Input
                        {...register("numInterior")}
                        type="text"
                        placeholder="4A"
                        className="py-2 px-4 md:px-5"
                      />
                    </div>

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
                )}

                {useExistingAddress && shippingAddress && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FiCheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-green-800">Dirección de envío guardada</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-0.5 pl-6">
                      <p className="font-medium">{shippingAddress.name}</p>
                      <p>
                        {shippingAddress.calle} {shippingAddress.numExterior}
                        {shippingAddress.numInterior ? ` Int. ${shippingAddress.numInterior}` : ""}
                      </p>
                      <p>Col. {shippingAddress.colonia}</p>
                      <p>{shippingAddress.municipio}, C.P. {shippingAddress.postalCode}</p>
                      {shippingAddress.referencias && (
                        <p className="text-gray-500 italic text-xs mt-1">{shippingAddress.referencias}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: Costo de envío ── */}
            {currentStep === 3 && (
              <div className="form-group animate-in fade-in duration-200">
                <h2 className="font-semibold text-base text-gray-700 pb-4">
                  {showingTranslateValue(checkout?.shipping_cost) || "Costo de Envío"}
                </h2>

                {/* Free shipping progress bar */}
                {!isFreeShipping && (
                  <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-orange-700 font-semibold flex items-center gap-1.5">
                        <FiTruck className="w-4 h-4" />
                        Progreso para envío gratis
                      </span>
                      <span className="text-orange-600 font-bold">
                        Faltan {currency}{Math.max(0, freeShippingThreshold - cartTotal).toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-orange-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-orange-600 mt-2">
                      Agrega {currency}{Math.max(0, freeShippingThreshold - cartTotal).toFixed(2)} más para obtener envío gratis
                    </p>
                  </div>
                )}

                {isFreeShipping ? (
                  <div className="col-span-6 bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-4">
                    <FiTruck className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-green-800 text-base">¡Felicidades! Tienes envío gratis</p>
                      <p className="text-sm text-green-600 mt-0.5">Tu compra califica para envío gratuito</p>
                    </div>
                    <span className="ml-auto font-extrabold text-green-700 text-lg">GRATIS</span>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <div>
                      <InputShipping
                        currency={currency}
                        register={register}
                        handleShippingCost={handleShippingCost}
                        name={showingTranslateValue(checkout?.shipping_name_one) || "Envío Estándar"}
                        description={showingTranslateValue(checkout?.shipping_one_desc) || "Entrega en 3-5 días - "}
                        value={Number(checkout?.shipping_one_cost) || 60}
                      />
                    </div>
                    <div>
                      <InputShipping
                        currency={currency}
                        register={register}
                        handleShippingCost={handleShippingCost}
                        name={showingTranslateValue(checkout?.shipping_name_two) || "Envío Express"}
                        description={showingTranslateValue(checkout?.shipping_two_desc) || "Entrega en 1-2 días - "}
                        value={Number(checkout?.shipping_two_cost) || 20}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Error errorMessage={errors.shippingOption} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 4: Método de pago ── */}
            {currentStep === 4 && (
              <div className="form-group animate-in fade-in duration-200">
                <h2 className="font-semibold text-base text-gray-700 pb-3">
                  {showingTranslateValue(checkout?.payment_method) || "Método de Pago"}
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
                              "::placeholder": { color: "#9CA3AF" },
                            },
                            invalid: { color: "#EF4444", iconColor: "#EF4444" },
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
                    <div>
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
                    <div>
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
            )}

            {/* Navigation buttons */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              {currentStep === 1 ? (
                <Link
                  href="/search"
                  className="col-span-1 h-11 rounded-md inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors border border-gray-200"
                >
                  <IoReturnUpBackOutline className="text-xl" />
                  Seguir comprando
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleBack}
                  className="col-span-1 h-11 rounded-md inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors border border-gray-200"
                >
                  <IoReturnUpBackOutline className="text-xl" />
                  Volver
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="col-span-1 h-11 rounded-md inline-flex items-center justify-center gap-2 bg-kachabazar-500 hover:bg-kachabazar-600 text-white font-medium text-sm transition-colors"
                >
                  Siguiente
                  <IoArrowForward className="text-xl" />
                </button>
              ) : (
                <Button
                  type="submit"
                  variant="create"
                  disabled={isEmpty || isCheckoutSubmit || (showCard && !stripe)}
                  isLoading={isCheckoutSubmit}
                  className="col-span-1 h-11 rounded-md"
                >
                  {isCheckoutSubmit ? (
                    showCard ? "Procesando pago..." : "Procesando..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Confirmar Pedido
                      <IoArrowForward className="text-xl" />
                    </span>
                  )}
                </Button>
              )}
            </div>

            {/* Step hint */}
            <p className="text-center text-xs text-gray-400 mt-3">
              Paso {currentStep} de {STEPS.length} — {STEPS[currentStep - 1].fullLabel}
            </p>
          </form>
        </div>
      </div>

      {/* Order summary */}
      <div className="md:w-full lg:w-2/5 lg:ml-10 xl:ml-14 md:ml-6 flex flex-col h-full md:sticky lg:sticky top-44 md:order-2 lg:order-2">
        <div className="border p-5 lg:px-8 lg:py-8 rounded-lg bg-white order-1 sm:order-2">
          <h2 className="font-semibold text-lg pb-4">Resumen de tu pedido</h2>

          <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-64 bg-gray-50 rounded-lg block">
            {items.map((item) => (
              <CartItem key={item.id} item={item} currency={currency} />
            ))}
          </div>

          {/* Coupon input */}
          <div className="mt-4 py-4 text-sm w-full font-semibold">
            {couponInfo.couponCode ? (
              <span className="bg-kachabazar-50 px-4 py-3 leading-tight w-full rounded-md flex justify-between">
                <p className="text-kachabazar-600">Cupón Aplicado</p>
                <span className="text-red-500 text-right">{couponInfo.couponCode}</span>
              </span>
            ) : (
              <div className="flex flex-row items-start justify-end">
                <Input
                  ref={couponRef}
                  type="text"
                  placeholder="Código de descuento"
                  className="px-4 py-2 h-10 mr-1 border border-gray-300 rounded-md focus:outline-none"
                />
                <Button onClick={handleCouponCode} className="h-10 rounded-sm" variant="create">
                  {showingTranslateValue(checkout?.apply_button) || "Aplicar"}
                </Button>
              </div>
            )}
          </div>

          {/* Summary lines */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800">
                {currency}{(items?.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0) || 0).toFixed(2)}
              </span>
            </div>
            {productDiscount > 0 && (
              <div className="flex justify-between text-orange-600">
                <span className="flex items-center gap-1">
                  <FiTag className="w-3.5 h-3.5" />
                  Descuento productos
                </span>
                <span className="font-semibold">-{currency}{productDiscount.toFixed(2)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between text-orange-600">
                <span className="flex items-center gap-1">
                  <FiGift className="w-3.5 h-3.5" />
                  Cupón/Recompensa
                </span>
                <span className="font-semibold">-{currency}{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-1">
                <FiTruck className="w-3.5 h-3.5" />
                Envío
              </span>
              {isFreeShipping ? (
                <span className="font-bold text-kachabazar-600">GRATIS</span>
              ) : (
                <span className="font-semibold text-gray-800">
                  {shippingCost > 0 ? `${currency}${shippingCost.toFixed(2)}` : "Por seleccionar"}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between text-gray-500 text-xs pt-1">
            <span>IVA (16%) incluido</span>
            <span>{currency}{(parseFloat(total) * 16 / 116).toFixed(2)}</span>
          </div>

          <div className="border-t mt-4">
            <div className="flex items-center font-bold justify-between pt-4 text-sm uppercase">
              Total
              <span className="font-extrabold text-lg">
                {currency}{parseFloat(total).toFixed(2)}
              </span>
            </div>
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
