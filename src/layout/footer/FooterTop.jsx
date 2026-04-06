import React from "react";
import { Truck, ShieldCheck, Heart, Award } from "lucide-react";
import useUtilsFunction from "@hooks/useUtilsFunction";

const FooterTop = ({ globalSetting, storeCustomizationSetting }) => {
  const { showingTranslateValue } = useUtilsFunction();
  const footer = storeCustomizationSetting?.footer;
  const freeShippingThreshold =
    Number(globalSetting?.free_shipping_threshold) || 599;

  const features = [
    {
      icon: Truck,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      title:
        showingTranslateValue(footer?.shipping_card) || "Envío Gratis",
      subtitle: `En pedidos desde $${freeShippingThreshold}`,
      desc: `Recibe tus productos en la puerta de tu casa sin costo adicional en compras superiores a $${freeShippingThreshold}.`,
    },
    {
      icon: ShieldCheck,
      color: "text-blue-600",
      bg: "bg-blue-100",
      title:
        showingTranslateValue(footer?.payment_card) || "Compra Segura",
      subtitle: "crokete.com.mx",
      desc: "Pago 100 % cifrado. Tus datos y tu dinero están siempre protegidos en cada transacción.",
    },
    {
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-100",
      title:
        showingTranslateValue(footer?.support_card) || "Gana Puntos",
      subtitle: "Con cada compra",
      desc: "Acumula puntos automáticamente y canjéalos como descuento directo en tu próximo pedido.",
    },
    {
      icon: Award,
      color: "text-amber-600",
      bg: "bg-amber-100",
      title:
        showingTranslateValue(footer?.offer_card) || "Sube de Nivel",
      subtitle: "Nuevo · Frecuente · VIP",
      desc: "A mayor nivel, más descuentos y beneficios exclusivos: envíos prioritarios, ofertas VIP y más.",
    },
  ];

  return (
    <section className="bg-sky-100 py-6 lg:py-8">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="trust-badge group">
              <div className={`trust-badge-icon ${f.bg} ${f.color}`}>
                <f.icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <span className="block text-sm font-semibold text-crokete-earth-800 leading-tight">
                  {f.title}
                </span>
                <span className="block text-xs font-medium text-gray-500 mt-0.5">
                  {f.subtitle}
                </span>
                <span className="hidden lg:block text-xs text-gray-400 mt-1 leading-relaxed">
                  {f.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FooterTop;

