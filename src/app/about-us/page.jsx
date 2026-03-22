import React from "react";
import Link from "next/link";

// ─── Inline SVG icons (zero dependencies, tree-shakeable) ───────────────────
const PawIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="32" cy="42" rx="12" ry="10" />
    <ellipse cx="18" cy="28" rx="6" ry="7" />
    <ellipse cx="30" cy="22" rx="5.5" ry="7" />
    <ellipse cx="38" cy="22" rx="5.5" ry="7" />
    <ellipse cx="48" cy="28" rx="6" ry="7" />
  </svg>
);

const HeartIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ShieldCheckIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const StarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const TruckIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const UsersIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LeafIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const AwardIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

// ─── Data ───────────────────────────────────────────────────────────────────

const commitments = [
  {
    icon: StarIcon,
    title: "Calidad Premium",
    description: "Seleccionamos solo las mejores marcas de croquetas y alimentos, verificando ingredientes y certificaciones para garantizar la nutrición óptima de tu mascota.",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: HeartIcon,
    title: "Bienestar Animal",
    description: "Cada producto que ofrecemos está pensado para mejorar la calidad de vida de tu perro. Trabajamos con veterinarios para asegurar que nuestras recomendaciones sean las mejores.",
    color: "text-rose-600 bg-rose-50",
  },
  {
    icon: ShieldCheckIcon,
    title: "Productos Confiables",
    description: "Solo trabajamos con proveedores verificados y marcas reconocidas. Cada producto pasa por un proceso de selección riguroso antes de llegar a nuestra tienda.",
    color: "text-kachabazar-600 bg-kachabazar-50",
  },
  {
    icon: UsersIcon,
    title: "Atención Personalizada",
    description: "Nuestro equipo conoce cada producto y está listo para ayudarte a elegir la mejor opción según la raza, edad y necesidades específicas de tu mascota.",
    color: "text-crokete-green-600 bg-crokete-green-50",
  },
];

const trustPoints = [
  {
    icon: LeafIcon,
    title: "Nutrición Especializada",
    description: "Asesoría en alimentación canina con base en las necesidades de cada raza y etapa de vida.",
  },
  {
    icon: TruckIcon,
    title: "Entrega Rápida",
    description: "Envío a domicilio en Zapopan y zona metropolitana de Guadalajara. Tu pedido llega rápido y seguro.",
  },
  {
    icon: AwardIcon,
    title: "Experiencia Real",
    description: "Somos dueños de mascotas. Entendemos lo que necesitan porque lo vivimos todos los días con nuestros propios peludos.",
  },
  {
    icon: PawIcon,
    title: "Comunidad Pet-Friendly",
    description: "Más que una tienda, somos una comunidad de amantes de las mascotas comprometidos con su bienestar.",
  },
];

const stats = [
  { value: "500+", label: "Productos disponibles" },
  { value: "1,000+", label: "Clientes felices" },
  { value: "50+", label: "Marcas premium" },
  { value: "24/7", label: "Soporte por WhatsApp" },
];

// ─── Metadata ───────────────────────────────────────────────────────────────

export const metadata = {
  title: "Quiénes Somos | Crokete - Tienda de mascotas",
  description:
    "Conoce a Crokete Pet: tu tienda de croquetas, accesorios y farmacia veterinaria en Zapopan, Jalisco. Nutrición premium para perros y gatos con atención personalizada.",
  keywords: [
    "croquetas",
    "alimento para mascotas",
    "accesorios",
    "farmacia veterinaria",
    "Zapopan",
    "Guadalajara",
    "tienda de mascotas",
  ],
  openGraph: {
    title: "Quiénes Somos | Crokete",
    description:
      "Tienda de croquetas y accesorios para mascotas en Zapopan. Alimento premium para perros y gatos.",
    url: "https://crokete.com.mx/about-us",
    images: [
      {
        url: "https://crokete.com.mx/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Quiénes Somos - Crokete",
      },
    ],
  },
};

// ─── Page Component ─────────────────────────────────────────────────────────

const AboutUs = () => {
  return (
    <div className="bg-white">

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — Hero
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-kachabazar-50 via-white to-crokete-cream-50">
        {/* Decorative floating paws */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <PawIcon className="absolute top-[10%] left-[5%] w-12 h-12 text-kachabazar-200 opacity-40 rotate-[-20deg]" />
          <PawIcon className="absolute top-[20%] right-[8%] w-8 h-8 text-crokete-cream-200 opacity-50 rotate-[15deg]" />
          <PawIcon className="absolute bottom-[15%] left-[12%] w-10 h-10 text-kachabazar-100 opacity-30 rotate-[30deg]" />
          <PawIcon className="absolute bottom-[25%] right-[15%] w-14 h-14 text-crokete-green-100 opacity-25 rotate-[-10deg]" />
          <PawIcon className="absolute top-[50%] left-[50%] w-16 h-16 text-kachabazar-100 opacity-15 rotate-[45deg]" />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-kachabazar-100 text-kachabazar-700 text-sm font-medium mb-6">
              <PawIcon className="w-4 h-4" />
              Tienda de mascotas en Guadalajara ZMG
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Nutrición y amor{" "}
              <span className="text-kachabazar-600">para tu mejor amigo</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              En <strong className="text-kachabazar-600">Crokete</strong> creemos que cada mascota merece alimentarse con los mejores productos.
              Somos una tienda fundada por amantes de los perros, comprometidos con ofrecer croquetas premium, accesorios de calidad y productos de farmacia veterinaria.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-kachabazar-500 hover:bg-kachabazar-600 text-white font-semibold rounded-lg transition-colors shadow-sm"
              >
                <PawIcon className="w-5 h-5" />
                Ver productos
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors border border-gray-200"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — Stats bar (social proof)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-kachabazar-600">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-kachabazar-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 3 — Nuestra Historia
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crokete-cream-100 text-crokete-earth-700 text-sm font-medium mb-4">
                <HeartIcon className="w-4 h-4" />
                Nuestra Historia
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Nació de un amor auténtico por las mascotas
              </h2>

              <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Crokete nació cuando nos dimos cuenta de lo difícil que era encontrar productos de <strong>calidad real</strong> para nuestros propios perros.
                  Las opciones en el mercado eran confusas: etiquetas engañosas, ingredientes que no entendíamos y poca información sobre nutrición canina.
                </p>
                <p>
                  Decidimos crear un espacio donde cada producto estuviera <strong>cuidadosamente seleccionado</strong>: croquetas con ingredientes reales, accesorios funcionales y productos de farmacia veterinaria de marcas confiables.
                </p>
                <p>
                  Hoy, desde <strong>Zapopan, Jalisco</strong>, servimos a cientos de familias que confían en nosotros para alimentar y cuidar a sus compañeros peludos.
                  Cada pedido que preparamos lo hacemos pensando en la salud y felicidad de tu mascota.
                </p>
              </div>

              {/* Signature-style detail */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-kachabazar-100 flex items-center justify-center ring-2 ring-white">
                    <PawIcon className="w-5 h-5 text-kachabazar-500" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-crokete-green-100 flex items-center justify-center ring-2 ring-white">
                    <HeartIcon className="w-5 h-5 text-crokete-green-500" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Fundado por amantes de mascotas, para amantes de mascotas
                </p>
              </div>
            </div>

            {/* Visual — decorative card with paw pattern */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-kachabazar-50 to-crokete-cream-50 overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center">
                <div className="text-center p-8">
                  <PawIcon className="w-20 h-20 text-kachabazar-300 mx-auto mb-4" />
                  <p className="text-xl font-bold text-kachabazar-600">Crokete</p>
                  <p className="text-sm text-gray-500 mt-1">Nutrición con amor desde Zapopan</p>
                </div>
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-crokete-green-100 opacity-60 -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-kachabazar-100 opacity-60 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 4 — Nuestro Compromiso (4 cards)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kachabazar-100 text-kachabazar-700 text-sm font-medium mb-4">
              <ShieldCheckIcon className="w-4 h-4" />
              Nuestro Compromiso
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              Lo que nos mueve cada día
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Cada decisión que tomamos está guiada por el bienestar de las mascotas y la confianza de sus dueños.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commitments.map((item) => (
              <div
                key={item.title}
                className="group bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-kachabazar-200 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${item.color} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <item.icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 5 — Por qué confiar en nosotros
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left text side */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crokete-green-100 text-crokete-green-700 text-sm font-medium mb-4">
                <AwardIcon className="w-4 h-4" />
                Confianza
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                ¿Por qué elegirnos?
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                No somos solo una tienda en línea — somos dueños de mascotas que entienden lo que necesitan tus peludos.
                Ponemos la misma dedicación en elegir los productos para ti que la que ponemos para nuestros propios perros.
              </p>

              {/* Quote / Testimonial style */}
              <div className="mt-8 p-5 bg-kachabazar-50 rounded-xl border-l-4 border-kachabazar-400">
                <p className="text-gray-700 italic leading-relaxed">
                  &ldquo;Cada producto que entra a nuestra tienda lo revisamos como si fuera para nuestras propias mascotas,
                  porque al final del día, lo es.&rdquo;
                </p>
                <p className="mt-3 text-sm font-semibold text-kachabazar-600 flex items-center gap-2">
                  <PawIcon className="w-4 h-4" />
                  El equipo de Crokete
                </p>
              </div>
            </div>

            {/* Right trust cards */}
            <div className="grid sm:grid-cols-2 gap-5">
              {trustPoints.map((point) => (
                <div
                  key={point.title}
                  className="flex gap-4 p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <point.icon className="w-6 h-6 text-kachabazar-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{point.title}</h4>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 6 — CTA Final
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-kachabazar-600 to-kachabazar-700">
        {/* Decorative paws */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <PawIcon className="absolute top-[15%] left-[5%] w-20 h-20 text-white opacity-[0.06] rotate-[-15deg]" />
          <PawIcon className="absolute bottom-[10%] right-[8%] w-16 h-16 text-white opacity-[0.08] rotate-[20deg]" />
          <PawIcon className="absolute top-[50%] right-[25%] w-24 h-24 text-white opacity-[0.04] rotate-[45deg]" />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Dale a tu mascota lo que merece
            </h2>
            <p className="mt-4 text-kachabazar-100 leading-relaxed">
              Explora nuestra selección de croquetas premium, accesorios y productos veterinarios.
              Tu peludo te lo agradecerá.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-kachabazar-600 font-semibold rounded-lg transition-colors shadow-sm"
              >
                <PawIcon className="w-5 h-5" />
                Explorar tienda
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent hover:bg-white/10 text-white font-semibold rounded-lg transition-colors border border-white/30"
              >
                Hablar con nosotros
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
