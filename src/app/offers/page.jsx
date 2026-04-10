import React from "react";

//internal imports
import OffersClient from "@components/offer/OffersClient";
import { getShowingStoreProducts } from "@services/ProductServices";
import { getShowingAttributes } from "@services/AttributeServices";
import {
  getGlobalSetting,
  getStoreCustomizationSetting,
} from "@services/SettingServices";
import StickyCart from "@components/cart/StickyCart";

// ─── Inline SVG icons ────────────────────────────────────────────────────────
const PawIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="32" cy="42" rx="12" ry="10" />
    <ellipse cx="18" cy="28" rx="6" ry="7" />
    <ellipse cx="30" cy="22" rx="5.5" ry="7" />
    <ellipse cx="38" cy="22" rx="5.5" ry="7" />
    <ellipse cx="48" cy="28" rx="6" ry="7" />
  </svg>
);

const TagIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

export const metadata = {
  title: "Ofertas y Descuentos | Crokete",
  description:
    "Aprovecha los mejores descuentos en productos para tu mascota. Ofertas exclusivas en alimentos, snacks y accesorios.",
  keywords: ["ofertas", "descuentos", "promociones", "mascotas", "productos"],
};

const Offers = async () => {
  const [
    { attributes },
    { storeCustomizationSetting },
    { discountedProducts },
    { globalSetting },
  ] = await Promise.all([
    getShowingAttributes(),
    getStoreCustomizationSetting(),
    getShowingStoreProducts({ category: "", title: "" }),
    getGlobalSetting(),
  ]);

  const currency = globalSetting?.default_currency || "$";

  return (
    <div className="min-h-screen bg-crokete-cream-50">
      <StickyCart currency={currency} />

      {/* ══════════════════════════════════════════════════════════════════
          Hero
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-crokete-cream-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <PawIcon className="absolute top-[8%] left-[4%] w-14 h-14 text-red-200 opacity-30 rotate-[-20deg]" />
          <PawIcon className="absolute top-[18%] right-[6%] w-10 h-10 text-crokete-cream-200 opacity-40 rotate-[15deg]" />
          <PawIcon className="absolute bottom-[12%] left-[10%] w-12 h-12 text-red-100 opacity-25 rotate-[30deg]" />
          <PawIcon className="absolute bottom-[20%] right-[12%] w-16 h-16 text-kachabazar-100 opacity-20 rotate-[-10deg]" />
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-2 sm:pt-5 sm:pb-2">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold mb-3 animate-pulse">
              <TagIcon className="w-3.5 h-3.5" />
              Precios rebajados
            </div>
            {/* <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Ofertas y{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-kachabazar-600">
                Descuentos
              </span>
            </h1> */}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          Products Grid
          ══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-10 pt-2 pb-4 sm:pt-3 sm:pb-10 lg:pt-6 lg:pb-14">
        <OffersClient
          discountedProducts={discountedProducts}
          attributes={attributes}
          currency={currency}
        />
      </div>
    </div>
  );
};

export default Offers;
