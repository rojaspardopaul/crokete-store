"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
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
import { FiChevronRight, FiHeadphones, FiMinus, FiPlus } from "react-icons/fi";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Fragment, useEffect, useMemo } from "react";

// Lazy-load share buttons — only loaded when product page renders
const ShareButtons = dynamic(
  () => import("@components/slug-card/ShareButtons"),
  { ssr: false, loading: () => <div className="h-10" /> }
);

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
            <div className="lg:sticky top-44 mt-6 lg:mt-0 self-start z-10 mx-auto lg:col-span-4 lg:row-span-2 lg:row-end-2 lg:max-w-none">
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
              <div className="flex items-center mb-4">
                <Price
                  price={price}
                  product={product}
                  currency={currency}
                  originalPrice={originalPrice}
                />
                <span className="ml-2 block">
                  <Discount slug product={product} discount={discount} />
                </span>
              </div>
              <LoyaltyPointsBadge price={price} size="md" className="mb-2" />
              <LoyaltyProductInfo className="mb-6" />
              {variantTitle?.length > 0 && (
                <div className="mb-4 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
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

              <div>
                <div className="flex items-center mt-4">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 w-full">
                    {/* Quantity Selector + Stock */}
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

                    {/* Add to Cart + WhatsApp */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => handleAddToCart(product, item)}
                        className="text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none px-4 py-3 w-full h-11"
                        variant="create"
                      >
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
                        className="h-11 text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mt-4">
                  <div className="flex items-center justify-between space-s-3 sm:space-s-4 w-full">
                    <div>
                      <span className=" font-semibold py-1 text-sm d-block">
                        <span className="text-gray-700">Categoría:</span>{" "}
                        <Link
                          href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                          className="cursor-pointer"
                        >
                          <button
                            type="button"
                            className="text-gray-600 font-medium ml-2 hover:text-teal-600"
                            onClick={() => setIsLoading(!isLoading)}
                          >
                            {category_name}
                          </button>
                        </Link>
                      </span>

                      <Tags product={product} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900">
                    Información de envío
                  </h3>
                  <div className="mt-4">
                    {/* shipping description card */}
                    <Card storeCustomization={storeCustomization} />
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900">
                    Compartir en redes sociales
                  </h3>
                  <p className="text-sm text-gray-500">
                    Comparte este producto con tus amigos
                  </p>
                  <ul role="list" className="mt-4 flex items-center space-x-6">
                    <ShareButtons slug={product?.slug} />
                  </ul>
                </div>
              </div>
            </div>
            <div className="mx-auto w-full lg:col-span-3 lg:my-0 my-8 lg:max-w-none">
              <TabGroup>
                <div className="border-b border-gray-200">
                  <TabList className="-mb-px flex space-x-8">
                    <Tab className="cursor-pointer border-b-2 border-transparent pb-3 text-sm font-medium whitespace-nowrap text-gray-700 hover:border-gray-300 focus:outline-0 hover:text-gray-800 data-selected:border-kachabazar-600 data-selected:text-kachabazar-600">
                      Opiniones de clientes
                    </Tab>

                    <Tab className="cursor-pointer border-b-2 border-transparent pb-3 text-sm font-medium whitespace-nowrap text-gray-700 hover:border-gray-300 focus:outline-0 hover:text-gray-800 data-selected:border-kachabazar-600 data-selected:text-kachabazar-600">
                      Descripción
                    </Tab>
                  </TabList>
                </div>
                <TabPanels as={Fragment}>
                  <TabPanel className="-mb-10">
                    <h3 className="sr-only">Opiniones de clientes</h3>
                    <ProductReviews reviews={reviews} />
                  </TabPanel>
                  <TabPanel className="pt-8">
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
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
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
