import React from "react";
import {
  Truck,
  ShieldCheck,
  Heart,
  Award,
  Star,
  Gift,
  Zap,
  Clock,
  Percent,
  Tag,
  Headphones,
  Package,
} from "lucide-react";
import useUtilsFunction from "@hooks/useUtilsFunction";

const ICON_MAP = {
  truck: Truck,
  "shield-check": ShieldCheck,
  heart: Heart,
  award: Award,
  star: Star,
  gift: Gift,
  zap: Zap,
  clock: Clock,
  percent: Percent,
  tag: Tag,
  headphones: Headphones,
  package: Package,
};

const COLOR_MAP = {
  truck: { color: "text-emerald-600", bg: "bg-emerald-100" },
  "shield-check": { color: "text-blue-600", bg: "bg-blue-100" },
  heart: { color: "text-red-500", bg: "bg-red-100" },
  award: { color: "text-amber-600", bg: "bg-amber-100" },
  star: { color: "text-yellow-500", bg: "bg-yellow-100" },
  gift: { color: "text-pink-600", bg: "bg-pink-100" },
  zap: { color: "text-orange-500", bg: "bg-orange-100" },
  clock: { color: "text-indigo-600", bg: "bg-indigo-100" },
  percent: { color: "text-green-600", bg: "bg-green-100" },
  tag: { color: "text-violet-600", bg: "bg-violet-100" },
  headphones: { color: "text-cyan-600", bg: "bg-cyan-100" },
  package: { color: "text-teal-600", bg: "bg-teal-100" },
};

const DEFAULTS = [
  {
    icon: "truck",
    title: "Envío Gratis",
    subtitle: "En pedidos desde $599",
    desc: "Recibe tus productos en la puerta de tu casa sin costo adicional en compras superiores a $599.",
  },
  {
    icon: "shield-check",
    title: "Compra Segura",
    subtitle: "crokete.com.mx",
    desc: "Pago 100 % cifrado. Tus datos y tu dinero están siempre protegidos en cada transacción.",
  },
  {
    icon: "heart",
    title: "Gana Puntos",
    subtitle: "Con cada compra",
    desc: "Acumula puntos automáticamente y canjéalos como descuento directo en tu próximo pedido.",
  },
  {
    icon: "award",
    title: "Sube de Nivel",
    subtitle: "Nuevo · Frecuente · VIP",
    desc: "A mayor nivel, más descuentos y beneficios exclusivos: envíos prioritarios, ofertas VIP y más.",
  },
];

const InformativeSection = ({ globalSetting, storeCustomizationSetting }) => {
  const { showingTranslateValue } = useUtilsFunction();
  const info = storeCustomizationSetting?.footer_info;

  if (info?.status === false) return null;

  const freeShippingThreshold =
    Number(globalSetting?.free_shipping_threshold) || 599;

  const features = [1, 2, 3, 4].map((n) => {
    const def = DEFAULTS[n - 1];
    const iconKey = info?.[`card${n}_icon`] || def.icon;
    const IconComp = ICON_MAP[iconKey] || Truck;
    const colors = COLOR_MAP[iconKey] || COLOR_MAP.truck;

    let title = showingTranslateValue(info?.[`card${n}_title`]) || def.title;
    let subtitle =
      showingTranslateValue(info?.[`card${n}_subtitle`]) || def.subtitle;
    let desc = showingTranslateValue(info?.[`card${n}_desc`]) || def.desc;

    // Inject dynamic threshold for first card
    if (n === 1) {
      subtitle = subtitle.replace(/\$\d+/, `$${freeShippingThreshold}`);
      desc = desc.replace(/\$\d+/, `$${freeShippingThreshold}`);
    }

    return { icon: IconComp, ...colors, title, subtitle, desc };
  });

  return (
    <section className="bg-sky-100 py-6 lg:py-8">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

export default InformativeSection;
