import React from "react";
import { redirect } from "next/navigation";

//internal imports
import OffersClient from "@components/offer/OffersClient";
import { getStoreCustomizationSetting } from "@services/SettingServices";
import { getAvailableRewards } from "@services/LoyaltyServices";
import { getUserServerSession } from "@lib/auth-server";

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

const StarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const metadata = {
  title: "Mis Ofertas | Crokete",
  description:
    "Descubre tus recompensas y ofertas exclusivas en Crokete.",
  keywords: ["ofertas", "descuentos", "recompensas", "puntos"],
};

const Offers = async () => {
  const { storeCustomizationSetting } = await getStoreCustomizationSetting();

  // Check if user is logged in
  const user = await getUserServerSession();
  if (!user?.email) {
    redirect("/auth/login?redirectUrl=offers");
  }

  const { data: rewardsData } = await getAvailableRewards();

  return (
    <div className="bg-white">
      {/* ══════════════════════════════════════════════════════════════════
          Hero
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-kachabazar-50 via-white to-crokete-cream-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <PawIcon className="absolute top-[10%] left-[5%] w-12 h-12 text-kachabazar-200 opacity-40 rotate-[-20deg]" />
          <PawIcon className="absolute top-[20%] right-[8%] w-8 h-8 text-crokete-cream-200 opacity-50 rotate-[15deg]" />
          <PawIcon className="absolute bottom-[15%] left-[12%] w-10 h-10 text-kachabazar-100 opacity-30 rotate-[30deg]" />
          <PawIcon className="absolute bottom-[25%] right-[15%] w-14 h-14 text-crokete-green-100 opacity-25 rotate-[-10deg]" />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-kachabazar-100 text-kachabazar-700 text-sm font-medium mb-6">
              <StarIcon className="w-4 h-4" />
              Programa de recompensas
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
              Mis Recompensas y <span className="text-kachabazar-600">Ofertas</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Acumula puntos con cada compra y canjéalos por descuentos exclusivos para tu mascota.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          Content
          ══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <OffersClient rewardsData={rewardsData} />
      </div>
    </div>
  );
};

export default Offers;
