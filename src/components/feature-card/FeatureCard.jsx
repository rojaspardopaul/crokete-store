import React from "react";
import { FiTruck, FiShield, FiHeart, FiAward } from "react-icons/fi";

//internal import
import useUtilsFunction from "@hooks/useUtilsFunction";

const FeatureCard = async ({ storeCustomizationSetting }) => {
  const { showingTranslateValue } = useUtilsFunction();
  const footer = storeCustomizationSetting?.footer;

  const featurePromo = [
    {
      id: 1,
      title: showingTranslateValue(footer?.shipping_card) || "Envío Rápido",
      subtitle: "A toda la zona metropolitana",
      icon: FiTruck,
      color: "text-kachabazar-600",
      bg: "bg-kachabazar-50",
    },
    {
      id: 2,
      title: showingTranslateValue(footer?.support_card) || "Atención Personalizada",
      subtitle: "WhatsApp y llamadas",
      icon: FiHeart,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      id: 3,
      title: showingTranslateValue(footer?.payment_card) || "Pago Seguro",
      subtitle: "Tarjeta, efectivo y más",
      icon: FiShield,
      color: "text-crokete-green-600",
      bg: "bg-crokete-green-50",
    },
    {
      id: 4,
      title: showingTranslateValue(footer?.offer_card) || "Calidad Premium",
      subtitle: "Productos verificados",
      icon: FiAward,
      color: "text-kachabazar-700",
      bg: "bg-kachabazar-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {featurePromo.map((promo) => (
        <div
          key={promo.id}
          className="trust-badge group"
        >
          <div className={`trust-badge-icon ${promo.bg} ${promo.color}`}>
            <promo.icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="block text-sm font-semibold text-crokete-earth-800 leading-tight">
              {promo.title}
            </span>
            <span className="block text-xs text-gray-500 mt-0.5">
              {promo.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCard;
