import React from "react";
import Link from "next/link";
import FaqAccordion from "@components/faq/FaqAccordion";

// ─── Inline SVG icons ───────────────────────────────────────────────────────

const PawIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="32" cy="42" rx="12" ry="10" />
    <ellipse cx="18" cy="28" rx="6" ry="7" />
    <ellipse cx="30" cy="22" rx="5.5" ry="7" />
    <ellipse cx="38" cy="22" rx="5.5" ry="7" />
    <ellipse cx="48" cy="28" rx="6" ry="7" />
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

const CreditCardIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const ShoppingBagIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const HeadphonesIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const MessageIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// ─── FAQ Data ───────────────────────────────────────────────────────────────

const faqCategories = [
  {
    id: "pedidos",
    title: "Pedidos y Entregas",
    icon: TruckIcon,
    color: "text-kachabazar-600 bg-kachabazar-50",
    faqs: [
      {
        question: "¿Cuáles son las zonas de entrega?",
        answer:
          "Realizamos entregas en Zapopan y toda la zona metropolitana de Guadalajara, incluyendo Tlaquepaque, Tonalá y Tlajomulco. Si estás fuera de esta zona, contáctanos por WhatsApp para verificar disponibilidad.",
      },
      {
        question: "¿Cuánto tiempo tarda mi pedido en llegar?",
        answer:
          "Los pedidos realizados antes de las 2:00 PM generalmente se entregan el mismo día o al día siguiente hábil. Para pedidos fuera de la zona metropolitana, el tiempo de entrega puede ser de 2 a 5 días hábiles dependiendo de la ubicación.",
      },
      {
        question: "¿Tiene costo el envío?",
        answer:
          "Ofrecemos envío gratis en pedidos superiores a $599 MXN dentro de la zona metropolitana de Guadalajara. Para pedidos menores, el costo de envío se calcula al momento del checkout según tu ubicación.",
      },
      {
        question: "¿Puedo rastrear mi pedido?",
        answer:
          "Sí, una vez que tu pedido sea enviado recibirás un correo electrónico y/o mensaje de WhatsApp con la confirmación. Además, puedes consultar el estado de tu pedido en cualquier momento desde la sección \"Mis Pedidos\" en tu cuenta.",
      },
    ],
  },
  {
    id: "productos",
    title: "Productos y Nutrición",
    icon: ShoppingBagIcon,
    color: "text-crokete-green-600 bg-crokete-green-50",
    faqs: [
      {
        question: "¿Cómo elijo la croqueta adecuada para mi perro?",
        answer:
          "Depende de la raza, edad, tamaño y condición de salud de tu mascota. En cada ficha de producto incluimos información detallada de ingredientes y recomendaciones. Si tienes dudas, nuestro equipo puede orientarte por WhatsApp con asesoría personalizada sin costo.",
      },
      {
        question: "¿Venden solo croquetas o también otros productos?",
        answer:
          "Además de croquetas y alimento seco/húmedo, ofrecemos snacks, premios, juguetes, accesorios, productos de higiene, farmacia veterinaria y suplementos nutricionales. Todo cuidadosamente seleccionado para el bienestar de tu mascota.",
      },
      {
        question: "¿Trabajan con marcas premium?",
        answer:
          "Sí, trabajamos exclusivamente con marcas reconocidas y verificadas. Cada producto pasa por un proceso de selección donde evaluamos la calidad de ingredientes, certificaciones y reputación del fabricante. Algunas de nuestras marcas incluyen opciones nacionales e internacionales de gama alta.",
      },
      {
        question: "¿Qué hago si mi mascota no acepta el alimento que compré?",
        answer:
          "Te recomendamos hacer un cambio gradual mezclando el nuevo alimento con el anterior durante 5-7 días. Si después de este período tu mascota no se adapta, contáctanos — podemos asesorarte para encontrar una alternativa más adecuada.",
      },
    ],
  },
  {
    id: "pagos",
    title: "Pagos y Facturación",
    icon: CreditCardIcon,
    color: "text-amber-600 bg-amber-50",
    faqs: [
      {
        question: "¿Qué métodos de pago aceptan?",
        answer:
          "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencia bancaria (SPEI), y pago en efectivo contra entrega en la zona metropolitana de Guadalajara. Todos los pagos con tarjeta se procesan de forma segura mediante Stripe.",
      },
      {
        question: "¿Puedo pagar en mensualidades?",
        answer:
          "Sí, para compras mayores a $1,000 MXN con tarjetas de crédito participantes, puedes seleccionar meses sin intereses (3, 6 o 12 MSI) directamente al momento del pago. La disponibilidad depende de tu banco emisor.",
      },
      {
        question: "¿Emiten factura?",
        answer:
          "Sí, emitimos factura fiscal (CFDI). Puedes solicitarla durante el proceso de compra o enviar tus datos fiscales por WhatsApp dentro de las 72 horas posteriores a tu compra.",
      },
    ],
  },
  {
    id: "cuenta",
    title: "Cuenta y Soporte",
    icon: HeadphonesIcon,
    color: "text-rose-600 bg-rose-50",
    faqs: [
      {
        question: "¿Necesito crear una cuenta para comprar?",
        answer:
          "Puedes explorar todos nuestros productos sin cuenta, pero para finalizar tu compra necesitas registrarte. Crear una cuenta te permite acceder a tu historial de pedidos, guardar direcciones de envío, acumular puntos de lealtad y recibir ofertas exclusivas.",
      },
      {
        question: "¿Cómo puedo contactarlos si tengo un problema?",
        answer:
          "Puedes contactarnos por WhatsApp (disponible 24/7), por correo electrónico o a través del formulario en nuestra página de contacto. Nuestro equipo responde en un máximo de 2 horas durante horario laboral (lunes a sábado, 9:00 AM - 7:00 PM).",
      },
      {
        question: "¿Tienen política de devoluciones?",
        answer:
          "Sí. Si recibes un producto dañado, incorrecto o en mal estado, cuentas con 48 horas para reportarlo. Te enviamos el producto correcto o realizamos el reembolso completo. Para productos de alimento abiertos, aplican condiciones especiales — contáctanos para más detalles.",
      },
      {
        question: "¿Tienen programa de lealtad o recompensas?",
        answer:
          "Sí, contamos con un programa de puntos donde acumulas recompensas con cada compra. Los puntos se pueden canjear por descuentos en pedidos futuros. Consulta la sección \"Mis Recompensas\" en tu cuenta para ver tu saldo y las promociones vigentes.",
      },
    ],
  },
];

// ─── Metadata ───────────────────────────────────────────────────────────────

export const metadata = {
  title: "Preguntas Frecuentes | Crokete - Tienda de mascotas",
  description:
    "Resuelve tus dudas sobre pedidos, entregas, pagos, productos y nutrición para mascotas. Crokete Pet en Zapopan, Jalisco.",
  keywords: [
    "preguntas frecuentes",
    "FAQ",
    "croquetas",
    "mascotas",
    "entregas Zapopan",
    "pagos",
    "nutrición canina",
  ],
  openGraph: {
    title: "Preguntas Frecuentes | Crokete",
    description:
      "Encuentra respuestas a tus preguntas sobre productos para mascotas, entregas y más.",
    url: "https://crokete.com.mx/faq",
    images: [
      {
        url: "https://crokete.com.mx/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Preguntas Frecuentes - Crokete",
      },
    ],
  },
};

// ─── Page Component ─────────────────────────────────────────────────────────

const Faq = () => {
  return (
    <div className="bg-white">

      {/* ══════════════════════════════════════════════════════════════════
          Hero
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-kachabazar-50 via-white to-crokete-cream-50">
        {/* Decorative paws */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <PawIcon className="absolute top-[12%] left-[6%] w-10 h-10 text-kachabazar-200 opacity-40 rotate-[-20deg]" />
          <PawIcon className="absolute top-[22%] right-[10%] w-8 h-8 text-crokete-cream-200 opacity-50 rotate-[15deg]" />
          <PawIcon className="absolute bottom-[18%] right-[20%] w-12 h-12 text-kachabazar-100 opacity-25 rotate-[30deg]" />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-22">
          <div className="text-center max-w-2xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-kachabazar-100 text-kachabazar-700 text-sm font-medium mb-6">
              <MessageIcon className="w-4 h-4" />
              Centro de ayuda
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Preguntas{" "}
              <span className="text-kachabazar-600">Frecuentes</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
              Encuentra respuestas rápidas sobre pedidos, entregas, productos y más.
              ¿No encuentras lo que buscas?{" "}
              <Link href="/contact-us" className="text-kachabazar-600 font-medium hover:underline">
                Contáctanos
              </Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          Category Quick Nav
          ══════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {faqCategories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="group flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-kachabazar-200 hover:shadow-sm transition-all duration-200"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${cat.color} transition-transform duration-200 group-hover:scale-110`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-kachabazar-600 transition-colors">
                  {cat.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FAQ Sections
          ══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto space-y-14 sm:space-y-18">
          {faqCategories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-24">
              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                  <category.icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {category.title}
                </h2>
              </div>

              {/* Accordion */}
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                {category.faqs.map((faq, index) => (
                  <FaqAccordion key={index} faq={faq} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          CTA — Still have questions?
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-kachabazar-600 to-kachabazar-700">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <PawIcon className="absolute top-[15%] left-[5%] w-16 h-16 text-white opacity-[0.06] rotate-[-15deg]" />
          <PawIcon className="absolute bottom-[10%] right-[8%] w-12 h-12 text-white opacity-[0.08] rotate-[20deg]" />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              ¿No resolvimos tu duda?
            </h2>
            <p className="mt-4 text-kachabazar-100 leading-relaxed">
              Nuestro equipo está listo para ayudarte. Escríbenos por WhatsApp o visita nuestra página de contacto.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-kachabazar-600 font-semibold rounded-lg transition-colors shadow-sm"
              >
                <MessageIcon className="w-5 h-5" />
                Contactar soporte
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent hover:bg-white/10 text-white font-semibold rounded-lg transition-colors border border-white/30"
              >
                <PawIcon className="w-5 h-5" />
                Explorar productos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
