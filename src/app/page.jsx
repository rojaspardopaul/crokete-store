import { Suspense } from "react";

//internal import
import Banner from "@components/banner/Banner";
import CardTwo from "@components/cta-card/CardTwo";
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

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Home = async () => {
  const { attributes } = await getShowingAttributes();
  const { storeCustomizationSetting, error: storeCustomizationError } =
    await getStoreCustomizationSetting();
  const { popularProducts, discountedProducts, error } =
    await getShowingStoreProducts({
      category: "",
      title: "",
    });

  const { globalSetting } = await getGlobalSetting();
  const currency = globalSetting?.default_currency || "$";

  // console.log("storeCustomizationSetting", storeCustomizationSetting);

  return (
    <div className="min-h-screen bg-crokete-cream-50 dark:bg-zinc-900">
      {/* Sticky cart lateral */}
      <StickyCart currency={currency} />

      {/* === HERO: Carousel + Rewards + Banner === */}
      <div className="bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5 space-y-3 lg:space-y-0">
          {/* Desktop: side by side · Mobile: stacked — both columns same height */}
          <div className="flex flex-col lg:flex-row w-full gap-3 lg:gap-5">
            {/* Carousel — fills sidebar height on lg via h-full */}
            <div className="w-full lg:w-3/5">
              <Suspense fallback={<div className="aspect-[2.5/1] lg:h-full animate-shimmer rounded-2xl" />}>
                <MainCarousel />
              </Suspense>
            </div>

            {/* Sidebar: Rewards + Banner — dictates shared height */}
            <div className="w-full lg:w-2/5 flex flex-col gap-3">
              {/* Rewards widget — grows to fill remaining space */}
              <div className="flex-1 min-h-0 flex flex-col">
                <Suspense fallback={<div className="flex-1 animate-shimmer rounded-2xl" />}>
                  <OfferCard />
                </Suspense>
              </div>

              {/* Banner promocional — compact inline */}
              <div className="bg-gradient-to-r from-kachabazar-50 to-kachabazar-100 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl dark:bg-slate-600 border border-kachabazar-200">
                <Banner storeCustomizationSetting={storeCustomizationSetting} />
              </div>
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

      {/* === BANNER PROMOCIONAL CTA === */}
      {storeCustomizationSetting?.home?.delivery_status && (
        <div className="block mx-auto max-w-screen-2xl">
          <div className="mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-10">
            <div className="lg:p-12 p-5 sm:p-8 bg-gradient-to-br from-kachabazar-500 to-kachabazar-700 shadow-lg text-white rounded-2xl">
              <CardTwo />
            </div>
          </div>
        </div>
      )}

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
