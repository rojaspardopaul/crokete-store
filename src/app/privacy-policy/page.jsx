import React from "react";
import Link from "next/link";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getStoreCustomizationSetting } from "@services/SettingServices";

// ─── Inline SVG icons (zero dependencies) ───────────────────────────────────
const PawIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="32" cy="42" rx="12" ry="10" />
    <ellipse cx="18" cy="28" rx="6" ry="7" />
    <ellipse cx="30" cy="22" rx="5.5" ry="7" />
    <ellipse cx="38" cy="22" rx="5.5" ry="7" />
    <ellipse cx="48" cy="28" rx="6" ry="7" />
  </svg>
);

const LockIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata = {
  title: "Aviso de Privacidad | Crokete - Tienda de mascotas",
  description:
    "Conoce cómo protegemos tu información personal en Crokete, tu tienda de croquetas y accesorios para mascotas en Zapopan, Jalisco.",
  keywords: ["aviso de privacidad", "protección de datos", "Crokete", "tienda mascotas"],
  openGraph: {
    title: "Aviso de Privacidad | Crokete",
    description:
      "Cómo protegemos tu información personal en Crokete, tu tienda de mascotas en Zapopan.",
    url: "https://crokete.com.mx/privacy-policy",
    images: [
      {
        url: "https://crokete.com.mx/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Aviso de Privacidad - Crokete",
      },
    ],
  },
};

// ─── Page Component ──────────────────────────────────────────────────────────
const PrivacyPolicy = async () => {
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();

  const privacy_policy = storeCustomizationSetting?.privacy_policy;
  const rawTitle = privacy_policy?.title;
  const title =
    rawTitle && typeof rawTitle === "object"
      ? rawTitle.es || rawTitle.en || "Aviso de Privacidad"
      : rawTitle || "Aviso de Privacidad";

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
              <LockIcon className="w-4 h-4" />
              Última actualización: 8 de marzo de 2026
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              {title}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              En <strong className="text-kachabazar-600">Crokete</strong> nos comprometemos a proteger tu información personal.
              Aquí te explicamos qué datos recopilamos, cómo los usamos y cómo los protegemos.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — Content
          ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 lg:p-16 prose prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-li:text-gray-600 prose-li:leading-relaxed
            prose-a:text-kachabazar-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-800">
            <CMSkeletonTwo
              html
              count={15}
              height={15}
              error={error}
              loading={false}
              data={privacy_policy?.description}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 3 — CTA Final
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
              ¿Tienes alguna pregunta?
            </h2>
            <p className="mt-4 text-kachabazar-100 leading-relaxed">
              Si tienes dudas sobre cómo manejamos tu información, no dudes en contactarnos.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-kachabazar-600 font-semibold rounded-lg transition-colors shadow-sm"
              >
                <LockIcon className="w-5 h-5" />
                Contáctanos
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent hover:bg-white/10 text-white font-semibold rounded-lg transition-colors border border-white/30"
              >
                <PawIcon className="w-5 h-5" />
                Explorar tienda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
