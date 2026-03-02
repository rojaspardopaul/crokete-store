import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  XIcon,
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  WhatsappIcon,
} from "react-share";

//internal imports

import useUtilsFunction from "@hooks/useUtilsFunction";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getUserServerSession } from "@lib/auth-server";

const Footer = async ({ error, storeCustomizationSetting }) => {
  const { showingTranslateValue } = useUtilsFunction();
  const footer = storeCustomizationSetting?.footer;
  const userInfo = await getUserServerSession();

  // console.log("userInfo", userInfo);

  return (
    <div className="pb-16 lg:pb-0 xl:pb-0 bg-white">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 py-6 lg:py-10 justify-between">
          {footer?.block1_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1">
              <h3 className="text-md font-semibold mb-3 lg:mb-4">
                <CMSkeletonTwo
                  count={1}
                  height={20}
                  // error={error}
                  loading={false}
                  data={footer?.block1_title}
                />
              </h3>
              <ul className="text-sm flex flex-col space-y-2">
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block1_sub_link1}`}
                    className="text-gray-600 inline-block w-full hover:text-kachabazar-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block1_sub_title1}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block1_sub_link2}`}
                    className="text-gray-600 inline-block w-full hover:text-kachabazar-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block1_sub_title2}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block1_sub_link3}`}
                    className="text-gray-600 inline-block w-full hover:text-kachabazar-500"
                  >
                    {showingTranslateValue(
                      storeCustomizationSetting?.footer_block_one_link_three_title
                    )}
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block1_sub_title3}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block1_sub_link4}`}
                    className="text-gray-600 inline-block w-full hover:text-kachabazar-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block1_sub_title4}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {footer?.block2_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1">
              <h3 className="text-md font-semibold mb-3 lg:mb-4">
                <CMSkeletonTwo
                  count={1}
                  height={20}
                  // error={error}
                  loading={false}
                  data={footer?.block2_title}
                />
              </h3>
              <ul className="text-sm flex flex-col space-y-2">
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block2_sub_link1}`}
                    className="text-gray-600 inline-block w-full hover:text-kachabazar-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block2_sub_title1}
                    />
                  </Link>
                </li>

                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block2_sub_link2}`}
                    className="text-gray-600 inline-block w-full hover:text-kachabazar-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block2_sub_title2}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block2_sub_link3}`}
                    className="text-gray-600 inline-block w-full hover:text-kachabazar-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block2_sub_title3}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${footer?.block2_sub_link4}`}
                    className="text-gray-600 inline-block w-full hover:text-kachabazar-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block2_sub_title4}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {footer?.block3_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1">
              <h3 className="text-md font-semibold mb-3 lg:mb-4">
                <CMSkeletonTwo
                  count={1}
                  height={20}
                  // error={error}
                  loading={false}
                  data={footer?.block3_title}
                />
              </h3>
              <ul className="text-sm flex flex-col space-y-2">
                <li className="flex items-baseline">
                  <Link
                    href={`${userInfo?.email ? footer?.block3_sub_link1 : "#"}`}
                    className="text-gray-600 inline-block w-full hover:text-kachabazar-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block3_sub_title1}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${userInfo?.email ? footer?.block3_sub_link2 : "#"}`}
                    className="text-gray-600 inline-block w-full hover:text-kachabazar-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block3_sub_title2}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${userInfo?.email ? footer?.block3_sub_link3 : "#"}`}
                    className="text-gray-600 inline-block w-full hover:text-kachabazar-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block3_sub_title3}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${userInfo?.email ? footer?.block3_sub_link4 : "#"}`}
                    className="text-gray-600 inline-block w-full hover:text-kachabazar-500"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      // error={error}
                      loading={false}
                      data={footer?.block3_sub_title4}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {footer?.block4_status && (
            <div className="pb-3.5 sm:pb-0 col-span-2 md:col-span-1">
              <Link
                href="/"
                className="inline-block mb-3"
                rel="noreferrer"
              >
                <Image
                  width={146}
                  height={100}
                  src={footer?.block4_logo || "/logo/logo-color.svg"}
                  alt="logo"
                  className="w-auto h-auto"
                  style={{ maxHeight: '80px', width: 'auto' }}
                  unoptimized={true}
                />
              </Link>
              <p className="leading-6 text-sm text-gray-600 mt-2">
                <CMSkeletonTwo
                  count={1}
                  height={10}
                  // error={error}
                  loading={false}
                  data={footer?.block4_address}
                />
                <br />
                <span> Telf : {footer?.block4_phone}</span>
                <br />
                <span> Correo : {footer?.block4_email}</span>
              </p>
            </div>
          )}
        </div>

        <hr className="hr-line"></hr>

        <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 bg-gray-50 shadow-sm border border-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 py-5 sm:py-6 items-center justify-between">
            <div className="col-span-1">
              {footer?.social_links_status && (
                <div>
                  {(footer?.social_facebook ||
                    footer?.social_twitter ||
                    footer?.social_pinterest ||
                    footer?.social_linkedin ||
                    footer?.social_whatsapp) && (
                    <span className="text-sm font-semibold block mb-2">
                      Síguenos
                    </span>
                  )}
                  <ul className="text-sm flex flex-wrap gap-2">
                    {footer?.social_facebook && (
                      <li className="transition ease-in-out duration-500">
                        <Link
                          href={`${footer?.social_facebook}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-gray-500 hover:text-white"
                        >
                          <FacebookIcon size={32} round />
                        </Link>
                      </li>
                    )}
                    {footer?.social_twitter && (
                      <li className="transition ease-in-out duration-500">
                        <Link
                          href={`${footer?.social_twitter}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-gray-500 hover:text-white"
                        >
                          <XIcon size={32} round />
                        </Link>
                      </li>
                    )}
                    {footer?.social_pinterest && (
                      <li className="transition ease-in-out duration-500">
                        <Link
                          href={`${footer?.social_pinterest}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-gray-500 hover:text-white"
                        >
                          <PinterestIcon size={32} round />
                        </Link>
                      </li>
                    )}
                    {footer?.social_linkedin && (
                      <li className="transition ease-in-out duration-500">
                        <Link
                          href={`${footer?.social_linkedin}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-gray-500 hover:text-white"
                        >
                          <LinkedinIcon size={32} round />
                        </Link>
                      </li>
                    )}
                    {footer?.social_whatsapp && (
                      <li className="transition ease-in-out duration-500">
                        <Link
                          href={`${footer?.social_whatsapp}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-gray-500 hover:text-white"
                        >
                          <WhatsappIcon size={32} round />
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="col-span-1 text-center">
              {footer?.bottom_contact_status && (
                <div>
                  <p className="text-sm font-semibold block">
                    Llámanos
                  </p>
                  <h5 className="text-xl font-bold text-kachabazar-500 mt-1">
                    {footer?.bottom_contact}
                  </h5>
                </div>
              )}
            </div>
            {footer?.payment_method_status && (
              <div className="col-span-1">
                <ul className="text-right">
                  <li className="transition hover:opacity-80 inline-flex">
                    <Image
                      width={274}
                      height={85}
                      className="w-full max-w-[200px] h-auto"
                      src={
                        footer?.payment_method_img ||
                        "/payment-method/payment-logo.png"
                      }
                      alt="método de pago"
                    />
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 flex justify-center py-2 sm:py-3">
        {/* <p className="text-sm text-gray-500 leading-6">
          Copyright {new Date().getFullYear()} @{" "}
          <Link
            href="https://themeforest.net/user/htmllover"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kachabazar-500"
          >
            HtmlLover
          </Link>
          , All rights reserved.
        </p> */}
      </div>
    </div>
  );
};

export default Footer;
