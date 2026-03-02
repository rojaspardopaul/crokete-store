import React from "react";
import { redirect } from "next/navigation";

//internal imports
import PageHeader from "@components/header/PageHeader";
import OffersClient from "@components/offer/OffersClient";
import { getStoreCustomizationSetting } from "@services/SettingServices";
import { getAvailableRewards } from "@services/LoyaltyServices";
import { getUserServerSession } from "@lib/auth-server";

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
    <div className="dark:bg-zinc-900">
      <PageHeader
        headerBg={storeCustomizationSetting?.offers?.header_bg}
        title="Mis Recompensas y Ofertas"
      />

      <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:py-20 sm:px-10">
        <OffersClient rewardsData={rewardsData} />
      </div>
    </div>
  );
};

export default Offers;
