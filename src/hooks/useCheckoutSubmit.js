import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "react-use-cart";
// import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

//internal import

import { UserContext } from "@context/UserContext";
import { getAllCoupons } from "@services/CouponServices";
import { notifyError, notifySuccess } from "@utils/toast";
import { addNotification } from "@services/NotificationServices";
import {
  addOrder,
  // addRazorpayOrder,
  // createOrderByRazorPay,
  createPaymentIntent,
  sendEmailInvoiceToCustomer,
} from "@services/OrderServices";
import { getUserSession } from "@lib/auth-client";
import { useSetting } from "@context/SettingContext";
import useUtilsFunction from "./useUtilsFunction";
// addShippingAddress server action replaced with direct API call in submitHandler
import requests, { setToken } from "@services/httpServices";

const useCheckoutSubmit = ({ shippingAddress }) => {
  const { dispatch } = useContext(UserContext);

  const [error, setError] = useState("");
  const [total, setTotal] = useState("");
  const [couponInfo, setCouponInfo] = useState({});
  const [minimumAmount, setMinimumAmount] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [isCouponAvailable, setIsCouponAvailable] = useState(false);
  const [loyaltyRewardCode, setLoyaltyRewardCode] = useState(null);
  const [isFreeShipping, setIsFreeShipping] = useState(false);

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const couponRef = useRef("");
  // const { error: razorPayError, isLoading, Razorpay } = useRazorpay();
  const { isEmpty, emptyCart, items, cartTotal } = useCart();

  const userInfo = getUserSession();
  const { globalSetting, storeSetting, storeCustomization } = useSetting();
  const { showDateFormat, showingTranslateValue } = useUtilsFunction();

  const currency = globalSetting?.default_currency || "$";

  // console.log("storeSetting", storeSetting);

  // console.log("res", data);

  const [autoFilled, setAutoFilled] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Coupon restore from cookie
  useEffect(() => {
    if (Cookies.get("couponInfo")) {
      const coupon = JSON.parse(Cookies.get("couponInfo"));
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountType);
      setMinimumAmount(coupon.minimumAmount);
    }
  }, [isCouponApplied]);

  // Auto-fill form with saved shipping address or session data
  useEffect(() => {
    if (autoFilled) return;

    if (shippingAddress && Object.keys(shippingAddress).length > 0) {
      setUseExistingAddress(true);
      const nameParts = (shippingAddress.name || "").trim().split(" ");
      setValue("firstName", nameParts[0] || "");
      setValue("lastName", nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");
      setValue("contact", shippingAddress.contact || "");
      setValue("email", shippingAddress.email || userInfo?.email || "");
      setValue("postalCode", shippingAddress.postalCode || "");
      setValue("colonia", shippingAddress.colonia || "");
      setValue("calle", shippingAddress.calle || "");
      setValue("numExterior", shippingAddress.numExterior || "");
      setValue("numInterior", shippingAddress.numInterior || "");
      setValue("municipio", shippingAddress.municipio || "");
      setValue("referencias", shippingAddress.referencias || "");
      setAutoFilled(true);
    } else if (userInfo) {
      setValue("email", userInfo.email);
      if (userInfo.name) {
        const nameParts = userInfo.name.trim().split(" ");
        setValue("firstName", nameParts[0] || "");
        setValue("lastName", nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");
      }
      if (userInfo.phone) {
        setValue("contact", userInfo.phone);
      }
      setAutoFilled(true);
    }
  }, [shippingAddress, userInfo, autoFilled]);

  //remove coupon if total value less then minimum amount of coupon, or cart is empty
  useEffect(() => {
    if (minimumAmount - discountAmount > total || isEmpty) {
      setDiscountPercentage(0);
      setIsCouponApplied(false);
      setLoyaltyRewardCode(null);
      Cookies.remove("couponInfo");
    }
  }, [minimumAmount, total, isEmpty]);

  //calculate total, product discount, coupon discount, and free shipping
  useEffect(() => {
    const discountProductTotal = items?.reduce(
      (preValue, currentValue) => preValue + currentValue.itemTotal,
      0
    );

    // Calculate product-level discount (originalPrice vs price)
    const prodDiscount = items?.reduce((acc, item) => {
      const orig = item.originalPrice || item.price;
      if (orig > item.price) {
        return acc + (orig - item.price) * item.quantity;
      }
      return acc;
    }, 0) || 0;

    setProductDiscount(prodDiscount);

    // Free shipping threshold check
    const freeShippingThreshold = Number(globalSetting?.free_shipping_threshold) || 599;
    const qualifiesForFreeShipping = cartTotal >= freeShippingThreshold;
    setIsFreeShipping(qualifiesForFreeShipping);
    const effectiveShipping = qualifiesForFreeShipping ? 0 : Number(shippingCost);

    // Coupon/loyalty discount
    const couponDiscount =
      discountPercentage?.type === "fixed"
        ? discountPercentage?.value
        : discountProductTotal * (discountPercentage?.value / 100);

    const couponDiscountTotal = couponDiscount ? couponDiscount : 0;

    const subTotal = parseFloat(cartTotal + effectiveShipping).toFixed(2);
    // Cap discount so the total never goes below $0
    const cappedDiscount = Math.min(couponDiscountTotal, Number(subTotal));
    const totalValue = Math.max(0, Number(subTotal) - cappedDiscount);

    setDiscountAmount(cappedDiscount);
    setTotal(totalValue);
  }, [cartTotal, shippingCost, discountPercentage, globalSetting]);

  const submitHandler = async (data) => {
    // console.log("data", data);
    // return;
    try {
      // Guard: never allow an order with an empty cart
      if (isEmpty || !items || items.length === 0) {
        notifyError("Tu carrito está vacío. Agrega productos antes de continuar.");
        return;
      }
      // dispatch({ type: "SAVE_SHIPPING_ADDRESS", payload: data });
      // Cookies.set("shippingAddress", JSON.stringify(data));
      setIsCheckoutSubmit(true);
      setError("");

      const userDetails = {
        name: `${data.firstName} ${data.lastName}`,
        contact: data.contact,
        email: data.email,
        postalCode: data.postalCode,
        colonia: data.colonia,
        calle: data.calle,
        numExterior: data.numExterior,
        numInterior: data.numInterior || "",
        municipio: data.municipio,
        referencias: data.referencias || "",
        estado: "Jalisco",
        pais: "México",
      };

      let orderInfo = {
        user_info: userDetails,
        shippingOption: isFreeShipping ? "Envío Gratis" : data.shippingOption,
        paymentMethod: data.paymentMethod,
        status: "pedido",
        cart: items,
        subTotal: cartTotal,
        shippingCost: isFreeShipping ? 0 : shippingCost,
        discount: discountAmount + productDiscount,
        total: total,
        loyaltyCouponCode: loyaltyRewardCode || null,
      };

      // Save / update the shipping address via direct API call (non-blocking)
      if (userInfo?.id && userInfo?.token) {
        requests
          .post(
            `/customer/shipping/address/${userInfo.id}`,
            userDetails,
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
          )
          .catch(() => {
            // non-critical, order proceeds regardless
          });
      }

      // Handle payment based on method
      switch (data.paymentMethod) {
        case "Card":
          // await handlePaymentWithStripe(orderInfo);
          await handlePaymentWithStripeV2(orderInfo);
          break;
        // case "RazorPay":
        //   await handlePaymentWithRazorpay(orderInfo);
        //   break;
        case "Cash":
          await handleCashPayment(orderInfo);
          break;
        default:
          throw new Error("Invalid payment method selected");
      }
    } catch (error) {
      notifyError(error?.response?.data?.message || error?.message);
      setIsCheckoutSubmit(false);
    }
  };

  // console.log("globalSetting", globalSetting?.email_to_customer);

  const handleOrderSuccess = async (orderResponse, orderInfo) => {
    // console.log("Order successful:", orderResponse, orderInfo);

    try {
      const notificationInfo = {
        orderId: orderResponse?._id,
        message: `${orderResponse?.user_info?.name
          } placed an order of ${parseFloat(orderResponse?.total).toFixed(2)}!`,
        image:
          userInfo?.image ||
          "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
      };

      const updatedData = {
        ...orderResponse,
        date: showDateFormat(orderResponse.createdAt),
        company_info: {
          currency: currency,
          vat_number: globalSetting?.vat_number,
          company: globalSetting?.company_name,
          address: globalSetting?.address,
          phone: globalSetting?.contact,
          email: globalSetting?.email,
          website: globalSetting?.website,
          from_email: globalSetting?.from_email,
        },
      };

      // console.log("notificaiton", notification);
      // if (error) {
      //   console.error("Failed to add notification:", error);
      //   return setIsCheckoutSubmit(false);
      // }
      // return setIsCheckoutSubmit(false);

      if (globalSetting?.email_to_customer) {
        // Trigger email in the background
        sendEmailInvoiceToCustomer(updatedData).catch((emailErr) => {
          console.error("Failed to send email invoice:", emailErr.message);
        });
      }
      // notification api call
      const { notification, error } = await addNotification(notificationInfo);

      // Proceed with order success
      router.push(`/order/${orderResponse?._id}`);      
      notifySuccess("Tu pedido ha sido confirmado! El comprobante se enviará a tu correo.");

      // Mark loyalty reward as used (if applicable)
      if (loyaltyRewardCode && userInfo?.token) {
        try {
          setToken(userInfo.token);
          await requests.post("/loyalty/use-reward", {
            couponCode: loyaltyRewardCode,
            orderId: orderResponse?._id,
          });
          setLoyaltyRewardCode(null);
        } catch (_) {
          // non-critical
        }
      }

      Cookies.remove("couponInfo");
      emptyCart();
      setIsCheckoutSubmit(false);
    } catch (err) {
      console.error("Order success handling error:", err.message);
      throw new Error(err.message);
    }
  };

  //handle cash payment
  const handleCashPayment = async (orderInfo) => {
    try {
      // console.log("Cash payment orderInfo:", orderInfo);
      const { orderResponse, error } = await addOrder(orderInfo);
      // console.log("orderResponse:", orderResponse, "error:", error);

      if (error) {
        setIsCheckoutSubmit(false);
        return notifyError(error);
      }

      if (!orderResponse) {
        setIsCheckoutSubmit(false);
        return notifyError("La orden no pudo ser creada. Por favor, inténtalo de nuevo.");
      }

      await handleOrderSuccess(orderResponse, orderInfo);
    } catch (err) {
      // console.error("Cash payment error:", err.message);
      setIsCheckoutSubmit(false);
      notifyError(err.message);
    }
  };

  //handle stripe payment
  const handlePaymentWithStripe = async (orderInfo) => {
    try {
      if (!stripe || !elements) {
        throw new Error("Stripe is not initialized");
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error || !paymentMethod) {
        throw new Error(error?.message || "Stripe payment failed");
      }

      const order = {
        ...orderInfo,
        cardInfo: paymentMethod,
      };

      const { stripeInfo } = await createPaymentIntent(order);
      // console.log("res", stripeInfo, "order", order);
      stripe.confirmCardPayment(stripeInfo?.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      // console.log("stripeInfo", stripeInfo);

      const orderData = { ...orderInfo, cardInfo: stripeInfo };
      const { orderResponse, error: orderError } = await addOrder(orderData);
      if (orderError) {
        setIsCheckoutSubmit(false);
        return notifyError(orderError);
      }
      await handleOrderSuccess(orderResponse, orderInfo);
    } catch (err) {
      // Instead of just throwing the error, rethrow it so that it can be caught by the main submit handler
      throw new Error(err.message); // Ensure the error is propagated properly
    }
  };

  const handlePaymentWithStripeV2 = async (orderInfo) => {
    try {
      if (!stripe || !elements) {
        throw new Error("Stripe no está inicializado. Recarga la página e inténtalo de nuevo.");
      }

      //Crear PaymentIntent en tu backend
      const { stripeInfo, error: intentError } = await createPaymentIntent(orderInfo);
      if (intentError) {
        throw new Error(intentError);
      }
      if (!stripeInfo?.client_secret) {
        throw new Error(stripeInfo?.message || "No se pudo iniciar el proceso de pago. Inténtalo de nuevo.");
      }

      //Confirmar pago desde frontend
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        stripeInfo.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: orderInfo.user_info?.name,
              email: orderInfo.user_info?.email,
            },
          },
        }
      );

      if (stripeError) {
        const friendlyMessage = translateStripeError(stripeError);
        setError(friendlyMessage);
        throw new Error(friendlyMessage);
      }

      if (paymentIntent.status !== "succeeded") {
        throw new Error("El pago no se completó. Por favor, inténtalo de nuevo.");
      }

      setError("");

      //Guardar la orden en DB (ya con pago confirmado)
      const orderData = { ...orderInfo, stripePaymentIntentId: paymentIntent.id };
      const { orderResponse, error: orderError } = await addOrder(orderData);

      if (orderError) {
        setIsCheckoutSubmit(false);
        return notifyError(orderError);
      }

      await handleOrderSuccess(orderResponse, orderInfo);
    } catch (err) {
      setIsCheckoutSubmit(false);
      notifyError(err.message);
    }
  };

  /**
   * Translates Stripe error codes to user-friendly Spanish messages.
   */
  const translateStripeError = (stripeError) => {
    const errorMap = {
      card_declined: "Tu tarjeta fue rechazada. Verifica los datos o usa otra tarjeta.",
      insufficient_funds: "Fondos insuficientes. Verifica tu saldo o usa otra tarjeta.",
      expired_card: "Tu tarjeta ha expirado. Usa una tarjeta vigente.",
      incorrect_cvc: "El código de seguridad (CVC) es incorrecto.",
      incorrect_number: "El número de tarjeta es incorrecto.",
      invalid_expiry_month: "El mes de expiración no es válido.",
      invalid_expiry_year: "El año de expiración no es válido.",
      processing_error: "Error al procesar tu tarjeta. Inténtalo de nuevo en unos momentos.",
      incorrect_zip: "El código postal no coincide con tu tarjeta.",
    };

    if (stripeError.decline_code && errorMap[stripeError.decline_code]) {
      return errorMap[stripeError.decline_code];
    }
    if (stripeError.code && errorMap[stripeError.code]) {
      return errorMap[stripeError.code];
    }
    return stripeError.message || "Error al procesar el pago. Inténtalo de nuevo.";
  };

  // Razorpay payment handler removed — not used
  // const handlePaymentWithRazorpay = async (orderInfo) => { ... };

  const handleShippingCost = (value) => {
    // console.log("handleShippingCost", value);
    setShippingCost(Number(value));
  };

  //handle default shipping address
  const handleDefaultShippingAddress = (value) => {
    // console.log("handle default shipping", value);
    setUseExistingAddress(value);
    if (value) {
      const address = shippingAddress;
      const nameParts = address?.name?.split(" "); // Split the name into parts
      const firstName = nameParts[0]; // First name is the first element
      const lastName =
        nameParts?.length > 1 ? nameParts[nameParts?.length - 1] : ""; // Last name is the last element, if it exists
      // console.log("address", address.name.split(" "), "value", value);

      setValue("firstName", firstName);
      setValue("lastName", lastName);

      setValue("contact", address.contact);
      setValue("email", address.email);
      setValue("postalCode", address.postalCode);
      setValue("colonia", address.colonia);
      setValue("calle", address.calle);
      setValue("numExterior", address.numExterior);
      setValue("numInterior", address.numInterior || "");
      setValue("municipio", address.municipio);
      setValue("referencias", address.referencias || "");
    } else {
      setValue("firstName", "");
      setValue("lastName", "");
      setValue("contact", "");
      // setValue("email");
      setValue("postalCode", "");
      setValue("colonia", "");
      setValue("calle", "");
      setValue("numExterior", "");
      setValue("numInterior", "");
      setValue("municipio", "");
      setValue("referencias", "");
    }
  };
  const handleCouponCode = async (e) => {
    e.preventDefault();

    if (!couponRef.current.value) {
      notifyError("Por favor, ingresa un código de cupón válido.");
      return;
    }
    setIsCouponAvailable(true);

    try {
      const { coupons, error } = await getAllCoupons();
      
      if (error || !coupons || !Array.isArray(coupons)) {
        setIsCouponAvailable(false);
        notifyError("Error al cargar los cupones. Por favor, inténtalo de nuevo.");
        return;
      }

      const result = coupons.filter(
        (coupon) => coupon.couponCode === couponRef.current.value
      );
      setIsCouponAvailable(false);

      if (result.length < 1) {        // Try loyalty reward coupon as fallback
        try {
          if (userInfo?.token) {
            setToken(userInfo.token);

            const rewardResult = await requests.post("/loyalty/apply-reward", {
              couponCode: couponRef.current.value,
              orderTotal: total,
            });

            if (rewardResult?.valid) {
              // Block if fixed-discount coupon face value exceeds current order total
              if (rewardResult.discountType === "fixed" && rewardResult.discountValue > total) {
                notifyError(
                  `El cupón ($${rewardResult.discountValue} MXN) supera el total de tu pedido ($${parseFloat(total).toFixed(2)} MXN). Agrega más productos para usarlo.`
                );
                return;
              }
              const rewardCoupon = {
                couponCode: rewardResult.couponCode,
                discountType: {
                  type: rewardResult.discountType,
                  value: rewardResult.discountValue,
                },
                minimumAmount: 0,
              };
              notifySuccess(
                `🎁 Recompensa aplicada: ${rewardResult.description}`
              );
              setIsCouponApplied(true);
              setMinimumAmount(0);
              setDiscountPercentage(rewardCoupon.discountType);
              setLoyaltyRewardCode(rewardResult.couponCode);
              dispatch({ type: "SAVE_COUPON", payload: rewardCoupon });
              Cookies.set("couponInfo", JSON.stringify(rewardCoupon), { sameSite: "Strict", secure: true });
              return;
            }
          }
        } catch (loyaltyErr) {
          // Loyalty reward not found either, show generic error
          console.log("Loyalty coupon check:", loyaltyErr?.response?.data?.message || loyaltyErr.message);
        }
        notifyError("Por favor, ingresa un código de cupón válido.");
        return;
      }

      if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
        notifyError("El cupón ha caducado. Por favor, ingresa un código de cupón válido.");
        return;
      }

      if (total < result[0]?.minimumAmount) {
        notifyError(
          `Se requiere un mínimo de ${currency}${result[0].minimumAmount} para aplicar este cupón.`
        );
        return;
      }

      // Block if fixed-discount coupon exceeds current order total
      if (result[0]?.discountType?.type === "fixed" && result[0]?.discountType?.value > total) {
        notifyError(
          `El cupón ($${result[0].discountType.value} MXN) supera el total de tu pedido ($${parseFloat(total).toFixed(2)} MXN). Agrega más productos para usarlo.`
        );
        return;
      }

      {
        notifySuccess(`Tu cupón ${result[0].couponCode} ha sido aplicado correctamente!`);
        setIsCouponApplied(true);
        setMinimumAmount(result[0]?.minimumAmount);
        setDiscountPercentage(result[0].discountType);
        dispatch({ type: "SAVE_COUPON", payload: result[0] });
        Cookies.set("couponInfo", JSON.stringify(result[0]), { sameSite: "Strict", secure: true });
      }
    } catch (error) {
      setIsCouponAvailable(false);
      return notifyError(error.message);
    }
  };

  return {
    register,
    errors,
    showCard,
    setShowCard,
    error,
    stripe,
    couponInfo,
    couponRef,
    total,
    isEmpty,
    items,
    cartTotal,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    handleCouponCode,
    discountPercentage,
    discountAmount,
    productDiscount,
    shippingCost,
    isFreeShipping,
    isCheckoutSubmit,
    isCouponApplied,
    useExistingAddress,
    isCouponAvailable,
    globalSetting,
    storeSetting,
    storeCustomization,
    currency,
    showingTranslateValue,
    handleDefaultShippingAddress,
    setValue,
    watch,
  };
};

export default useCheckoutSubmit;
