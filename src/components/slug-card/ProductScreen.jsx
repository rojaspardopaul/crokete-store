"use client";

import Link from "next/link";

import { ArrowDown, ArrowUp, ChevronRight, Minus, Plus } from "lucide-react";

//internal import

import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import Tags from "@components/common/Tags";
import Card from "@components/slug-card/Card";
import useAddToCart from "@hooks/useAddToCart";
import Discount from "@components/common/Discount";
import LoyaltyPointsBadge from "@components/loyalty/LoyaltyPointsBadge";
import LoyaltyProductInfo from "@components/loyalty/LoyaltyProductInfo";
import ProductCard from "@components/product/ProductCard";
import VariantList from "@components/variants/VariantList";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductGallery from "@components/product/ProductGallery";
import { useSetting } from "@context/SettingContext";
import useProductAction from "@hooks/useProductAction";
import Rating from "@components/common/Rating";
import { Button } from "@components/ui/button";
import ProductReviews from "./ProductReviews";
import WhatsAppButton from "@components/button/WhatsAppButton";
import { FiChevronRight, FiShoppingCart, FiPlus, FiHeadphones, FiMinus } from "react-icons/fi";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";

// v2 product detail components
import VisualTagsBadges from "@components/product/VisualTagsBadges";
import QuickInfoChips from "@components/product/QuickInfoChips";
import IconTagsRow from "@components/product/IconTagsRow";
import PackageInfoBar from "@components/product/PackageInfoBar";
import ProductHighlightsList from "@components/product/ProductHighlightsList";
import KeyFactsPills from "@components/product/KeyFactsPills";
import ProductInfoTabs from "@components/product/ProductInfoTabs";

const ProductScreen = ({ product, reviews, attributes, relatedProducts }) => {
  const { globalSetting, storeCustomization } = useSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const currency = globalSetting?.default_currency || "$";
  const { item, setItem } = useAddToCart();
  const {
    value,
    setValue,
    price,
    stock,
    discount,
    isReadMore,
    setIsReadMore,
    selectedImage,
    originalPrice,
    setSelectedImage,
    selectVariant,
    setSelectVariant,
    setSelectVa,
    variantTitle,
    category_name,
    // actions
    handleAddToCart,
  } = useProductAction({
    product,
    attributes,
    globalSetting,
  });

  // Clamp quantity selector when variant stock changes
  useEffect(() => {
    if (stock > 0 && item > stock) {
      setItem(stock);
    }
  }, [stock]);

  // Merge product images with unique variant images
  const allImages = useMemo(() => {
    const imgs = [...(product?.image || [])];
    if (product?.variants?.length) {
      product.variants.forEach((v) => {
        if (v.image && !imgs.includes(v.image)) {
          imgs.push(v.image);
        }
      });
    }
    return imgs;
  }, [product?.image, product?.variants]);

  // Compute effective packageInfo from selected variant name (e.g. "3kg", "500g")
  const effectivePackageInfo = useMemo(() => {
    const base = product?.packageInfo;
    if (!base || !variantTitle?.length || !selectVariant) return base;

    for (const att of variantTitle) {
      const selected = att.variants?.find((v) => v._id === selectVariant[att._id]);
      if (!selected) continue;
      const nameStr = showingTranslateValue(selected.name) || "";
      const match = nameStr.match(/^([\d.,]+)\s*(kg|g|lb)$/i);
      if (match) {
        const raw = parseFloat(match[1].replace(",", "."));
        const unit = match[2].toLowerCase();
        const weightKg = unit === "g" ? raw / 1000 : raw;
        const displayUnit = unit === "g" ? "kg" : unit;
        return { ...base, weight: weightKg, unit: displayUnit };
      }
    }
    return base;
  }, [product?.packageInfo, variantTitle, selectVariant, showingTranslateValue]);

  const [shareOpen, setShareOpen] = useState(false);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/product/${product?.slug}`;

  return (
    <>
      <div className="bg-white px-0">
        <div className="container mx-auto px-3 sm:px-10 max-w-screen-2xl">
          <div className="flex items-center py-6 lg:py-8">
            <ol className="flex items-center w-full overflow-hidden ">
              <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-kachabazar-500 font-semibold">
                <Link href="/">Home</Link>
              </li>
              <li className="text-sm mt-[1px]">
                {" "}
                <FiChevronRight />{" "}
              </li>
              <li className="text-sm pl-1 transition duration-200 ease-in cursor-pointer hover:text-kachabazar-500 font-semibold ">
                <Link
                  href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                >
                  <button
                    type="button"
                    onClick={() => setIsLoading(!isLoading)}
                  >
                    {category_name}
                  </button>
                </Link>
              </li>
              <li className="text-sm mt-[1px]">
                {" "}
                <FiChevronRight />{" "}
              </li>
              <li className="text-sm px-1 transition duration-200 ease-in ">
                {showingTranslateValue(product?.title)}
              </li>
            </ol>
          </div>
          {/* Product */}
          <div className="relative lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-4 lg:gap-y-8">
            {/* Product image */}
            <div className="lg:col-span-3 lg:row-end-1">
              {/* Image gallery */}
              <ProductGallery
                images={allImages}
                selectedImage={selectedImage}
                onImageChange={setSelectedImage}
                size="lg"
                enableZoom={true}
              />
            </div>

            {/* Product details */}
            <div className="relative lg:sticky top-0 lg:top-44 mt-6 lg:mt-0 self-start z-10 mx-auto lg:col-span-4 lg:row-span-2 lg:row-end-2 lg:max-w-none space-y-5">
              {/* Share floating button — top-right corner */}
              <div className="absolute top-0 right-0 z-50">
                <div className="relative">
                  {shareOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setShareOpen(false)} />
                  )}
                  <button
                    type="button"
                    onClick={() => setShareOpen((v) => !v)}
                    className="relative z-50 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-kachabazar-600 hover:border-kachabazar-300 transition-colors"
                    aria-label="Compartir"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  {shareOpen && (
                    <div className="absolute top-10 right-0 z-50 bg-white rounded-xl border border-gray-200 shadow-xl p-3 flex items-center gap-2.5 min-w-max">
                      <span className="text-[11px] text-gray-400 pr-2 border-r border-gray-100">Compartir</span>
                      {/* Facebook */}
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-[#1877F2] hover:bg-blue-100 transition-colors"
                        aria-label="Facebook"
                        onClick={() => setShareOpen(false)}
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4">
                          <path fillRule="evenodd" clipRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" />
                        </svg>
                      </a>
                      {/* WhatsApp */}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-green-50 text-[#25D366] hover:bg-green-100 transition-colors"
                        aria-label="WhatsApp"
                        onClick={() => setShareOpen(false)}
                      >
                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                      {/* X / Twitter */}
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors"
                        aria-label="X / Twitter"
                        onClick={() => setShareOpen(false)}
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4">
                          <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <VisualTagsBadges visualTags={product?.visualTags} />
              <div className="mb-2 md:mb-2.5 block -mt-1.5">
                <h1 className="leading-7 text-lg md:text-xl lg:text-2xl mb-1 font-semibold  text-gray-800">
                  {showingTranslateValue(product?.title)}
                </h1>
                <div className="flex gap-0.5 items-center mt-1">
                  <Rating
                    size="md"
                    showReviews={true}
                    rating={product?.average_rating}
                    totalReviews={product?.total_reviews}
                  />
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                <Price
                  price={price}
                  product={product}
                  currency={currency}
                  originalPrice={originalPrice}
                />
                <Discount slug product={product} discount={discount} />
                <LoyaltyPointsBadge price={price} size="md" />
              </div>

              {/* ── Actions ── */}
              <div className="rounded-xl border border-kachabazar-100 bg-gradient-to-br from-kachabazar-50/30 to-white p-4 space-y-4 shadow-sm">
                {variantTitle?.length > 0 && (
                  <div className="bg-white/70 rounded-lg px-3 py-2.5 border border-gray-100">
                    <h3 className="text-xs font-medium text-gray-500 mb-2">Elige tu opción</h3>
                    {variantTitle.map((a, i) => (
                      <div key={a._id} className={`${i > 0 ? 'mt-4 pt-3 border-t border-gray-200' : ''}`}>
                        <h4 className="text-sm py-1 text-gray-800 font-medium mb-1">
                          {showingTranslateValue(a?.name)}:
                        </h4>
                        <VariantList
                          att={a._id}
                          option={a.option}
                          setValue={setValue}
                          varTitle={variantTitle}
                          setSelectVa={setSelectVa}
                          variants={product.variants}
                          selectVariant={selectVariant}
                          setSelectVariant={setSelectVariant}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="group flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border h-11 border-gray-300">
                    <Button
                      variant="outline"
                      onClick={() => setItem(item - 1)}
                      disabled={item === 1}
                      className="border-0 border-e-1 border-gray-300 rounded-none flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-10 md:w-12 text-heading hover:text-gray-500"
                    >
                      <span className="text-dark sm:text-2xl">
                        <Minus />
                      </span>
                    </Button>
                    <p className="font-semibold flex items-center justify-center transition-colors duration-250 ease-in-out cursor-default flex-shrink-0 text-base text-heading w-10 md:w-20 xl:w-22">
                      {item}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setItem(item + 1)}
                      disabled={selectVariant?.quantity <= item}
                      className="border-0 border-s-1 border-gray-300 rounded-none flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-10 md:w-12 text-heading hover:text-gray-500"
                    >
                      <span className="text-dark sm:text-2xl">
                        <Plus />
                      </span>
                    </Button>
                  </div>
                  <Stock stock={stock} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleAddToCart(product, item)}
                    className="text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none px-4 py-3 w-full h-12"
                    variant="create"
                  >
                    <span className="relative mr-2 inline-flex w-5 h-5 shrink-0">
                      <FiShoppingCart className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-2.5 h-2.5 rounded-full bg-white">
                        <FiPlus className="w-1.5 h-1.5 text-teal-500" />
                      </span>
                    </span>
                    Agregar al carrito
                  </Button>
                  <WhatsAppButton
                    product={{
                      ...product,
                      title: showingTranslateValue(product?.title),
                      price: price,
                      prices: { price: price },
                      sku: product?.sku
                    }}
                    quantity={item}
                    variant={selectVariant}
                    fullWidth={true}
                    className="h-12 text-sm"
                  />
                </div>

                <LoyaltyProductInfo />
              </div>

              {/* ── Product Info ── */}
              <div className="space-y-2">
                <QuickInfoChips quickInfo={product?.quickInfo} />
                <IconTagsRow iconTags={product?.iconTags} />
                <PackageInfoBar packageInfo={effectivePackageInfo} price={price} />
              </div>

              {/* ── Highlights & Key Facts ── */}
              {(product?.productHighlights?.length > 0 || product?.keyFacts?.length > 0) && (
                <div className="rounded-xl bg-gray-50 p-4 space-y-3 border border-gray-100">
                  <ProductHighlightsList highlights={product?.productHighlights} />
                  <KeyFactsPills keyFacts={product?.keyFacts} />
                </div>
              )}


            </div>
            <div className="mx-auto w-full lg:col-span-3 lg:my-0 my-8 lg:max-w-none">
              <ProductInfoTabs
                product={product}
                effectivePackageInfo={effectivePackageInfo}
                showingTranslateValue={showingTranslateValue}
                reviewsPanel={
                  <>
                    <h3 className="sr-only">Opiniones de clientes</h3>
                    <ProductReviews reviews={reviews} />
                  </>
                }
                descriptionPanel={
                  <div className="pt-8">
                    <h3 className="sr-only">Descripción del producto</h3>
                    <p className="text-sm leading-6 text-gray-500 md:leading-6 mb-3">
                      {isReadMore
                        ? showingTranslateValue(product?.description)?.slice(
                            0,
                            150
                          )
                        : showingTranslateValue(product?.description)}
                    </p>
                    <div className="text-sm text-gray-500 [&_h4]:mt-5 [&_h4]:font-medium [&_h4]:text-gray-900 [&_li]:pl-2 [&_li::marker]:text-gray-300 [&_p]:my-2 [&_p]:text-sm/6 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-sm/6 [&>:first-child]:mt-0" />
                  </div>
                }
              />
            </div>
          </div>

          {/* Información de envío — sección full-width diferenciada */}
          <div className="mt-8 rounded-2xl bg-kachabazar-50 border border-kachabazar-100 px-6 py-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-kachabazar-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-kachabazar-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12h12l1-12" />
                </svg>
              </span>
              <h3 className="text-sm font-semibold text-kachabazar-700">Información de envío</h3>
            </div>
            <Card storeCustomization={storeCustomization} />
          </div>

          {/* related products */}
          {relatedProducts?.length >= 2 && (
            <div className="pt-10 lg:pt-20 lg:pb-10">
              <h3 className="text-xl font-semibold tracking-tight text-pretty sm:text-3xl mb-6">
                Productos relacionados
              </h3>
              <div className="flex">
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                    {relatedProducts?.slice(1, 13).map((product, i) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        attributes={attributes}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductScreen;
