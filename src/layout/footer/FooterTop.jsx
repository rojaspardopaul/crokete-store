import React from "react";
import { Truck, ShieldCheck, Star, Trophy } from "lucide-react";

const getFeatures = (freeShippingThreshold) => [
  {
    Icon: Truck,
    accent: "#10B981",
    title: "Envío Gratis",
    subtitle: `En pedidos desde $${freeShippingThreshold}`,
    desc: `Recibe tus productos en la puerta de tu casa sin costo adicional en compras superiores a $${freeShippingThreshold}.`,
  },
  {
    Icon: ShieldCheck,
    accent: "#3B82F6",
    title: "Compra Segura",
    subtitle: "crokete.com.mx",
    desc: "Pago 100 % cifrado. Tus datos y tu dinero están siempre protegidos en cada transacción.",
  },
  {
    Icon: Star,
    accent: "#F59E0B",
    title: "Gana Puntos",
    subtitle: "Con cada compra",
    desc: "Acumula puntos automáticamente y canjéalos como descuento directo en tu próximo pedido.",
  },
  {
    Icon: Trophy,
    accent: "#A855F7",
    title: "Sube de Nivel",
    subtitle: "Nuevo · Frecuente · VIP",
    desc: "A mayor nivel, más descuentos y beneficios exclusivos: envíos prioritarios, ofertas VIP y más.",
  },
];

const FooterTop = ({ globalSetting }) => {
  const freeShippingThreshold = Number(globalSetting?.free_shipping_threshold) || 599;
  const features = getFeatures(freeShippingThreshold);
  return (
    <section
      id="downloadApp"
      className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-14 lg:py-20 overflow-hidden"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-10">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-3">
            ¿Por qué elegirnos?
          </p>
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            Todo lo que tu mascota merece,{" "}
            <span className="text-blue-400">con total confianza</span>
          </h2>
          <p className="text-slate-400 mt-4 text-base max-w-xl mx-auto leading-relaxed">
            Compra en{" "}
            <span className="text-blue-400 font-semibold">crokete.com.mx</span>{" "}
            y disfruta de una experiencia diseñada para ti y tu mascota.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ Icon, accent, title, subtitle, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-1"
              style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            >
              {/* Icon badge */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: accent + "22" }}
              >
                <Icon size={22} color={accent} strokeWidth={1.8} />
              </div>

              {/* Text */}
              <h3 className="text-white font-bold text-lg leading-snug mb-1">
                {title}
              </h3>
              <p
                className="text-xs font-semibold mb-3 tracking-wide"
                style={{ color: accent }}
              >
                {subtitle}
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom tag line */}
        <p className="text-center text-slate-500 text-xs mt-10 tracking-wide">
          🐾 Crokete Pet · Tu tienda de confianza para mascotas
        </p>
      </div>
    </section>
  );
};

export default FooterTop;

