//internal imports
import React from "react";
import "@styles/custom.css";
import "@styles/custom-theme.css";
import Providers from "./provider";
import Navbar from "@layout/navbar/Navbar";
import Footer from "@layout/footer/Footer";
import FooterTop from "@layout/footer/FooterTop";
import MobileFooter from "@layout/footer/MobileFooter";
import FeatureCard from "@components/feature-card/FeatureCard";
import {
  getStoreSetting,
  getGlobalSetting,
  getStoreCustomizationSetting,
} from "@services/SettingServices";

import { SettingProvider } from "@context/SettingContext";
import { APP_CONFIG } from "@/config/appConfig";

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const { globalSetting } = await getGlobalSetting();
  const shopName = globalSetting?.shop_name || APP_CONFIG.SHOP_NAME;
  
  return {
    title: `${shopName} - Next Store e-commerce Template`,
    description: `${shopName} - Plataforma de comercio electrónico`,
  };
}

export default async function RootLayout({ children }) {
  const { globalSetting } = await getGlobalSetting();
  const { storeSetting } = await getStoreSetting();

  // Fetch all customization data at once (adjust your API to return full data)
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();

  return (
    <html lang="es" className="" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-white antialiased dark:bg-zinc-900"
      >
        <div>
          <SettingProvider
            initialGlobalSetting={globalSetting}
            initialStoreSetting={storeSetting}
            initialCustomizationSetting={storeCustomizationSetting}
          >
            <Providers storeSetting={storeSetting}>
              <Navbar
                globalSetting={globalSetting}
                storeCustomization={storeCustomizationSetting}
              />
              <main className="bg-gray-50 dark:bg-zinc-900 z-10">
                {children}
              </main>
              {/* <div className="bg-gray-50 dark:bg-zinc-900 z-10">{children}</div> */}
              {/* <MobileFooter globalSetting={globalSetting} /> */}
              <div className="w-full">
                <FooterTop
                  error={error}
                  storeCustomizationSetting={storeCustomizationSetting}
                />
                <div className="hidden relative  lg:block mx-auto max-w-screen-2xl py-6 px-3 sm:px-10">
                  <FeatureCard
                    storeCustomizationSetting={storeCustomizationSetting}
                  />
                </div>
                <hr className="hr-line"></hr>
                <div className="border-t border-gray-100 w-full">
                  <Footer
                    error={error}
                    storeCustomizationSetting={storeCustomizationSetting}
                  />
                </div>
              </div>
            </Providers>
          </SettingProvider>
        </div>
      </body>
    </html>
  );
}
