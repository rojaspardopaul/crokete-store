"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@components/ui/button";
import { openWhatsAppProduct, openWhatsAppCart } from "@utils/whatsapp";
import { useSetting } from "@context/SettingContext";
import { getUserSession } from "@lib/auth-client";

/**
 * Componente de botón para ordenar por WhatsApp
 * Puede usarse para productos individuales o para el carrito completo
 */
const WhatsAppButton = ({
  // Para producto individual
  product = null,
  quantity = 1,
  variant = null,
  
  // Para carrito completo
  items = null,
  cartTotal = 0,
  
  // Personalización
  className = "",
  size = "default",
  variant: buttonVariant = "default",
  children = null,
  fullWidth = false,
  showIcon = true,
}) => {
  const { globalSetting } = useSetting();
  const userInfo = getUserSession();
  const [isOpening, setIsOpening] = useState(false);
  
  // Obtener número de WhatsApp desde configuración o usar el número por defecto
  const whatsappNumber = globalSetting?.whatsapp || globalSetting?.phone || "+523310448051";
  
  // Obtener moneda desde configuración
  const currency = globalSetting?.default_currency || "$";
  
  // Obtener nombre del cliente si está logueado
  const customerName = userInfo?.name || null;
  
  const handleClick = () => {
    setIsOpening(true);
    
    try {
      if (items && items.length > 0) {
        // Modo carrito: enviar todo el carrito
        openWhatsAppCart(items, cartTotal, whatsappNumber, currency, customerName);
      } else if (product) {
        // Modo producto individual
        openWhatsAppProduct(
          product,
          quantity,
          variant,
          whatsappNumber,
          customerName,
          currency
        );
      }
    } catch (error) {
      console.error("Error al abrir WhatsApp:", error);
    } finally {
      // Reset loading state después de un breve delay
      setTimeout(() => setIsOpening(false), 1000);
    }
  };
  
  // Determinar el texto del botón
  const getButtonText = () => {
    if (children) return children;
    if (items) return "Enviar a WhatsApp";
    return "Pedir por WhatsApp";
  };
  
  return (
    <Button
      onClick={handleClick}
      disabled={isOpening || (!product && (!items || items.length === 0))}
      className={`bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      size={size}
      variant={buttonVariant}
    >
      {showIcon && <FaWhatsapp className={`${isOpening ? "animate-pulse" : ""}`} />}
      {isOpening ? "Abriendo..." : getButtonText()}
    </Button>
  );
};

export default WhatsAppButton;
