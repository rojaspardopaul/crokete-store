import { Suspense } from "react";

//internal import
import OfferCard from "@components/offer/OfferCard";
import StickyCart from "@components/cart/StickyCart";
import ProductCard from "@components/product/ProductCard";
import MainCarousel from "@components/carousel/MainCarousel";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getShowingStoreProducts } from "@services/ProductServices";
import { getShowingAttributes } from "@services/AttributeServices";
import {
  getGlobalSetting,
  getStoreCustomizationSetting,
} from "@services/SettingServices";
import DiscountedCard from "@components/product/DiscountedCard";
import DeliveryBannerMobile from "@components/banner/DeliveryBannerMobile";

const Home = async () => {
  // Parallelize all data fetches — eliminates sequential waterfall
  const [
    { attributes },
    { storeCustomizationSetting, error: storeCustomizationError },
    { popularProducts, discountedProducts, error },
    { globalSetting },
  ] = await Promise.all([
    getShowingAttributes(),
    getStoreCustomizationSetting(),
    getShowingStoreProducts({ category: "", title: "" }),
    getGlobalSetting(),
  ]);
  const currency = globalSetting?.default_currency || "$";

  // console.log("storeCustomizationSetting", storeCustomizationSetting);

  return (
    <div className="min-h-screen bg-crokete-cream-50 dark:bg-zinc-900">
      {/* Sticky cart lateral */}
      <StickyCart currency={currency} />

      {/* Mobile delivery banner */}
      <DeliveryBannerMobile freeShippingThreshold={Number(globalSetting?.free_shipping_threshold) || 599} />

      {/* === HERO: Carousel + Rewards === */}
      <div className="bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5">
          {/* Desktop: side by side · Mobile: stacked */}
          <div className="flex flex-col lg:flex-row w-full gap-3 lg:gap-5 lg:min-h-[220px]">
            {/* Carousel */}
            <div className="w-full lg:w-3/5">
              <Suspense fallback={<div className="aspect-[2.5/1] lg:h-full animate-shimmer rounded-2xl" />}>
                <MainCarousel />
              </Suspense>
            </div>

            {/* Rewards widget — stretch to match carousel height */}
            <div className="w-full lg:w-2/5 lg:self-stretch">
              <Suspense fallback={<div className="h-full min-h-[160px] animate-shimmer rounded-2xl" />}>
                <OfferCard />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* === PRODUCTOS POPULARES === */}
      {storeCustomizationSetting?.home?.popular_products_status && (
        <div className="bg-crokete-cream-50 dark:bg-zinc-900 pt-4 sm:pt-6 lg:pt-8 pb-6 sm:pb-8 lg:pb-10 mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-10">
          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-crokete-earth-900 uppercase tracking-wide mb-3 sm:mb-4">
            Productos Favoritos
          </h2>
          <div className="flex">
            <div className="w-full">
              {error ? (
                <CMSkeletonTwo
                  count={20}
                  height={20}
                  error={error}
                  loading={false}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                  {popularProducts
                    ?.slice(
                      0,
                      storeCustomizationSetting?.home
                        ?.latest_discount_product_limit
                    )
                    .map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        attributes={attributes}
                        currency={currency}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === BANNER PROMOCIONAL CTA (removed) === */}

      {/* === PRODUCTOS CON DESCUENTO === */}
      {storeCustomizationSetting?.home?.discount_product_status &&
        discountedProducts?.length > 0 && (
          <div
            id="discount"
            className="bg-crokete-cream-100 dark:bg-zinc-800 pt-4 sm:pt-6 lg:pt-8 pb-6 sm:pb-8 lg:pb-10 mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-10"
          >
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-crokete-earth-900 uppercase tracking-wide mb-3 sm:mb-4">
              Productos con Descuento
            </h2>
            <div className="flex">
              <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                  {discountedProducts
                    ?.slice(
                      0,
                      storeCustomizationSetting?.home?.popular_product_limit
                    )
                    .map((product) => (
                      <DiscountedCard
                        key={product._id}
                        product={product}
                        currency={currency}
                        attributes={attributes}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Home;
