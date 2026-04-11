import React from "react";
import Image from "next/image";
import { FiMail, FiMapPin, FiBell } from "react-icons/fi";

//internal import
import { showingTranslateValue } from "@lib/translate";
import PageHeader from "@components/header/PageHeader";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import ContactForm from "@components/contact/ContactForm";
import { getStoreCustomizationSetting } from "@services/SettingServices";

export const metadata = {
  title: "Contáctanos | Crokete",
  description:
    "¡Contáctanos! Encuentra nuestra información de contacto y envíanos tu mensaje. Estamos en Zapopan, Jalisco.",
  keywords: ["contacto", "soporte", "croquetas", "mascotas", "Zapopan"],
  // You can also add more advanced metadata here
  openGraph: {
    title: "Contáctanos | Crokete",
    description:
      "Tienda de croquetas y accesorios para mascotas en Zapopan. Contáctanos para cualquier consulta.",
    url: "https://crokete.com.mx/contact-us",
    images: [
      {
        url: "https://crokete.com.mx/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Contáctanos",
      },
    ],
  },
};

const ContactUs = async () => {
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();

  const contact_us = storeCustomizationSetting?.contact_us;

  return (
    <div className="">
      <PageHeader headerBg={contact_us?.header_bg} />

      <div className="bg-white dark:bg-zinc-900">
        <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-4 sm:px-10">
          {/* contact promo */}
          <div className="grid md:grid-cols-2 gap-6 lg:grid-cols-3 xl:gap-8 ">
            {error ? (
              <CMSkeletonTwo
                count={10}
                height={20}
                error={error}
                loading={false}
              />
            ) : (
              <div className="border p-10 rounded-lg text-center">
                <span className="flex justify-center text-4xl text-kachabazar-500 mb-4">
                  <FiMail />
                </span>
                <h5 className="text-xl mb-2 font-bold">
                  {showingTranslateValue(contact_us?.email_box_title)}
                </h5>
                <p className="mb-0 text-base opacity-90 leading-7">
                  <a
                    href={`mailto:${contact_us?.email_box_email}`}
                    className="text-kachabazar-500"
                  >
                    {showingTranslateValue(contact_us?.email_box_email)}
                  </a>{" "}
                  {showingTranslateValue(contact_us?.email_box_text)}
                </p>
              </div>
            )}

            {error ? (
              <CMSkeletonTwo
                count={10}
                height={20}
                error={error}
                loading={false}
              />
            ) : (
              <div className="border p-10 rounded-lg text-center">
                <span className="flex justify-center text-4xl text-kachabazar-500 mb-4">
                  <FiBell />
                </span>
                <h5 className="text-xl mb-2 font-bold">
                  {showingTranslateValue(contact_us?.call_box_title)}
                </h5>
                <p className="mb-0 text-base opacity-90 leading-7">
                  <a
                    href={`mailto:${contact_us?.call_box_phone}`}
                    className="text-kachabazar-500"
                  >
                    {showingTranslateValue(contact_us?.call_box_phone)}
                  </a>{" "}
                  {showingTranslateValue(contact_us?.call_box_text)}
                </p>
              </div>
            )}
            {error ? (
              <CMSkeletonTwo
                count={10}
                height={20}
                error={error}
                loading={false}
              />
            ) : (
              <div className="border p-10 rounded-lg text-center">
                <span className="flex justify-center text-4xl text-kachabazar-500 mb-4">
                  <FiMapPin />
                </span>
                <h5 className="text-xl mb-2 font-bold">
                  {showingTranslateValue(contact_us?.address_box_title)}
                </h5>
                <p className="mb-0 text-base opacity-90 leading-7">
                  <span>
                    {showingTranslateValue(
                      storeCustomizationSetting?.contact_us
                        ?.address_box_address_one
                    )}
                  </span>{" "}
                  <br />
                  {showingTranslateValue(
                    storeCustomizationSetting?.contact_us
                      ?.address_box_address_two
                  )}{" "}
                  <br />
                  {showingTranslateValue(
                    storeCustomizationSetting?.contact_us
                      ?.address_box_address_three
                  )}
                </p>
              </div>
            )}
          </div>

          {/* contact form */}
          <div className="px-0 pt-24 mx-auto items-center flex flex-col md:flex-row w-full justify-between">
            <div className="hidden md:w-full lg:w-5/12 lg:flex flex-col h-full">
              <Image
                width={874}
                height={874}
                src={contact_us?.midLeft_col_img || "/contact-us.png"}
                alt="logo"
                className="block w-auto"
              />
            </div>
            <div className="px-0 pb-2 lg:w-5/12 flex flex-col md:flex-row">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
