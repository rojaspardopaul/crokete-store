import dayjs from "dayjs";
import Cookies from "js-cookie";
import { APP_CONFIG } from "@/config/appConfig";

const useUtilsFunction = (globalSetting) => {
  const lang = Cookies.get("_lang") ?? "es";

  //for date and time format
  const showTimeFormat = (data, timeFormat) => {
    return dayjs(data).format(timeFormat);
  };

  const showDateFormat = (data) => {
    return dayjs(data).format("DD MMM, YYYY, h:aa A");
  };

  const showDateTimeFormat = (data, date, time) => {
    return dayjs(data).format(`${date} ${time}`);
  };

  //for formatting number

  const getNumber = (value = 0) => {
    return Number(parseFloat(value || 0).toFixed(2));
  };

  const getNumberTwo = (value = 0) => {
    return parseFloat(value || 0).toFixed(2);
  };

  //for translation
  const showingTranslateValue = (data) => {
    // console.log("lang:::", lang, "data", data);

    return data !== undefined && Object?.keys(data).includes(lang)
      ? data[lang]
      : data?.es;
  };

  const showingImage = (data) => {
    return data !== undefined && data;
  };

  const showingUrl = (data) => {
    return data !== undefined ? data : "!#";
  };

  const shopName = globalSetting?.shop_name || APP_CONFIG.SHOP_NAME;

  return {
    lang,
    shopName,
    getNumber,
    getNumberTwo,
    showTimeFormat,
    showDateFormat,
    showingImage,
    showingUrl,
    showDateTimeFormat,
    showingTranslateValue,
  };
};

export default useUtilsFunction;
