/**
 * TODO:
 * Para poder cambiar el logo, hay que cambiar el src de la imagen con id "navbar-logo". 
 */

import Link from "next/link";
import Image from "next/image";

//internal imports
import TopNavbar from "./TopNavbar";
import NavbarPromo from "@layout/navbar/NavbarPromo";
import SearchInput from "@components/navbar/SearchInput";
import NotifyIcon from "@components/navbar/NotifyIcon";
import ProfileDropDown from "@components/navbar/ProfileDropDown";
import { getShowingLanguage } from "@services/SettingServices";
import { getShowingCategory } from "@services/CategoryService";
import MobileFooter from "@layout/footer/MobileFooter";
import { Truck } from "lucide-react";

const Navbar = async ({ globalSetting, storeCustomization }) => {
  // Parallelize language + category fetches
  const [{ languages }, { categories, error: categoryError }] =
    await Promise.all([getShowingLanguage(), getShowingCategory()]);

  const currency = globalSetting?.default_currency || "$";

  return (
    // Navbar.jsx
    <div className="sticky z-20 top-0 w-full">
      {/* navbar top section */}

      <TopNavbar storeCustomization={storeCustomization} />

      <header as="header" className="bg-kachabazar-700 shadow-md">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
          <div className="relative flex flex-row h-14 sm:h-20 justify-between items-center gap-3">
            <div className="relative z-10 flex flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  id="navbar-logo"
                  className="h-auto max-h-9 sm:max-h-16 w-auto object-contain"
                  src={storeCustomization?.navbar?.logo || "/logo/logo-light.svg"}
                  alt="Crokete"
                  width={160}
                  height={64}
                  priority
                />
              </Link>
            </div>

            {/* search input section */}
            <div className="min-w-0 flex-1 md:px-4 lg:px-6 xl:col-span-6">
              <SearchInput />
            </div>

            {/* notification icons */}
            <div className="lg:relative lg:z-10 sm:flex sm:items-center hidden">
              <NotifyIcon currency={currency} />

              {/* Profile dropdown */}
              <div className="relative ml-4 flex-shrink-0">
                <ProfileDropDown />
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* navbar bottom */}
      <NavbarPromo
        languages={languages}
        categories={categories}
        categoryError={categoryError}
      />
      {/* Delivery banner for tablets & small laptops (hidden on mobile footer, hidden on lg+ where NavbarPromo shows it) */}
      <div className="hidden sm:flex lg:hidden bg-kachabazar-600 text-white items-center justify-center gap-2 py-1.5 px-3 text-xs font-medium">
        <Truck className="w-4 h-4 flex-shrink-0" />
        <span>
          Entregas el mismo día y{" "}
          <strong className="text-yellow-300">gratis</strong> a partir de{" "}
          <strong className="text-yellow-300">
            ${Number(globalSetting?.free_shipping_threshold) || 599}
          </strong>
        </span>
      </div>
      <MobileFooter
        categories={categories}
        categoryError={categoryError}
        globalSetting={globalSetting}
      />
    </div>
  );
};

export default Navbar;
