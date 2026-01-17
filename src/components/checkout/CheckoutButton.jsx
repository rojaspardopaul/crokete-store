"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import useTranslation from "next-translate/useTranslation";

//internal imports
import useUtilsFunction from "@hooks/useUtilsFunction";
import { IoArrowForward } from "react-icons/io5";

const CheckoutButton = ({ stripe, isEmpty, storeCustomizationSetting }) => {
  const { t } = useTranslation();
  const { pendiente } = useFormStatus();
  const { showingTranslateValue } = useUtilsFunction();
  // console.log("pendiente", pendiente);
  return (
    <button
      type="submit"
      disabled={isEmpty || pendiente}
      className="bg-kachabazar-500 hover:bg-kachabazar-600 border cursor-pointer border-kachabazar-500 transition-all rounded py-3 text-center text-sm font-medium text-white flex justify-center w-full"
    >
      {pendiente ? (
        <span className="flex justify-center text-center">
          <img src="/loader/spinner.gif" alt="Loading" width={20} height={10} />
          <span className="ml-2">{t("common:procesando")}</span>
        </span>
      ) : (
        <span className="flex justify-center text-center">
          {showingTranslateValue(
            storeCustomizationSetting?.checkout?.confirm_button
          )}
          <span className="text-xl ml-2">
            {" "}
            <IoArrowForward />
          </span>
        </span>
      )}
    </button>
  );
};

export default CheckoutButton;
