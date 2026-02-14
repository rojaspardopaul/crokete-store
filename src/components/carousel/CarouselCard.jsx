"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CarouselCard = ({ storeCustomizationSetting, sliderData }) => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      loop={true}
      pagination={
        (storeCustomizationSetting?.slider?.bottom_dots ||
          storeCustomizationSetting?.slider?.both_slider) && {
          clickable: true,
        }
      }
      navigation={
        (storeCustomizationSetting?.slider?.left_right_arrow ||
          storeCustomizationSetting?.slider?.both_slider) && {
          clickable: true,
        }
      }
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {sliderData?.map((item, i) => (
        <SwiperSlide
          className="h-full relative rounded-lg overflow-hidden dark:bg-zinc-900"
          key={i + 1}
        >
          <div className="text-sm text-gray-600 hover:text-kachabazar-dark dark:bg-zinc-900">
            <Image
              width={950}
              height={400}
              src={item.image}
              alt={item.title || "Slider image"}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          {/* Mobile Layout - Below 768px */}
          <div className="absolute inset-0 z-10 flex flex-col justify-start pt-3 min-[416px]:pt-8 px-3 md:hidden">
            <div className="max-w-full" style={{ maxWidth: '45%' }}>
              <h1 className="text-base sm:text-lg font-bold text-gray-800 mb-1 line-clamp-2" style={{ lineHeight: '1.2' }}>
                {item.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 line-clamp-4" style={{ lineHeight: '1.3' }}>
                {item.info}
              </p>
            </div>
          </div>
          {/* Desktop Layout - 768px and above */}
          <div className="hidden md:flex absolute inset-0 z-10 flex-col justify-center pl-10 pr-16">
            <div className="w-10/12 lg:w-8/12 xl:w-7/12" style={{ maxWidth: '45%' }}>
              <h1 className="mb-2 text-2xl lg:text-3xl font-bold text-gray-800">
                {item.title}
              </h1>
              <p className="text-base leading-6 text-gray-600 font-sans">
                {item.info}
              </p>
              <Link
                href={item.url}
                className="inline-block text-sm leading-6 font-medium mt-6 px-6 py-2 bg-kachabazar-500 text-center rounded-md text-white hover:bg-kachabazar-600"
              >
                {item.buttonName}
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CarouselCard;
