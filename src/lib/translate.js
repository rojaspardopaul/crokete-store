"use server";
import { cookies } from "next/headers";

const showingTranslateValue = async (data) => {
  const cookieStore = await cookies(); // `cookies()` itself is a sync call, returns cookies store
  const lang = cookieStore.get("_lang")?.value || "es";

  const updatedData =
    data !== undefined && Object?.keys(data).includes(lang)
      ? data[lang]
      : data?.es;
  return updatedData;
};

export { showingTranslateValue };
