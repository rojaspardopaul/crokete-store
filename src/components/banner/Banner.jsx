import Link from "next/link";
import React from "react";

//internal import

import { getStoreCustomizationSetting } from "@services/SettingServices";
import { showingTranslateValue } from "@lib/translate";

const Banner = async ({}) => {
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();
  const home = storeCustomizationSetting?.home;

  return (
    <>
      <div className="flex flex-row justify-between items-center gap-3">
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base lg:text-xl">
            <span className="text-kachabazar-600 dark:text-gray-200 font-bold line-clamp-1">
              {showingTranslateValue(home?.promotion_title)}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {showingTranslateValue(home?.promotion_description)}
          </p>
        </div>
        <Link
          href={`${home?.promotion_button_link}`}
          className="text-xs sm:text-sm font-medium px-4 sm:px-6 py-1.5 sm:py-2 bg-kachabazar-500 text-center rounded-full text-white hover:bg-kachabazar-700 whitespace-nowrap flex-shrink-0"
        >
          {showingTranslateValue(home?.promotion_button_name)}
        </Link>
      </div>
    </>
  );
};

export default Banner;
