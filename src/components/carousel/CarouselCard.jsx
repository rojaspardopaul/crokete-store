"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const CarouselCard = ({ sliderData }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  // Filter out slides with no image
  const slides = sliderData?.filter((s) => s.image) || [];
  if (slides.length === 0) return null;

  return (
    <div className="relative w-full lg:h-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-800">
      {/* Viewport */}
      <div ref={emblaRef} className="overflow-hidden lg:h-full">
        <div className="flex lg:h-full">
          {slides.map((item, i) => (
            <div
              key={item.id || i}
              className="relative flex-[0_0_100%] min-w-0 lg:h-full"
            >
              {/* Aspect ratio on mobile · fill parent height on lg (matched to sidebar) */}
              <div className="relative aspect-[2.5/1] lg:aspect-auto lg:h-full">
                <Image
                  src={item.image}
                  alt={item.title || `Slide ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority={i === 0}
                />

                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent dark:from-zinc-900/70 dark:via-zinc-900/30" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="w-[55%] sm:w-[50%] lg:w-[45%] pl-4 sm:pl-6 lg:pl-10 pr-2">
                    <h2 className="text-sm sm:text-lg lg:text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="hidden sm:block mt-1 lg:mt-2 text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
                      {item.info}
                    </p>
                    {item.url && item.buttonName && (
                      <Link
                        href={item.url}
                        className="hidden sm:inline-block mt-2 lg:mt-4 text-xs sm:text-sm font-semibold px-4 sm:px-5 lg:px-6 py-1.5 sm:py-2 bg-kachabazar-500 rounded-full text-white hover:bg-kachabazar-600 transition-colors shadow-sm"
                      >
                        {item.buttonName}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Ir a slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === selectedIndex
                  ? "w-5 h-2 bg-kachabazar-500"
                  : "w-2 h-2 bg-gray-400/50 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselCard;
