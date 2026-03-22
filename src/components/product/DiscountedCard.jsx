"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { IoAdd, IoExpand, IoBagAdd, IoRemove } from "react-icons/io5";
import { useCart } from "react-use-cart";
import Link from "next/link";

//internal import

import { notifyError } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import { handleLogEvent } from "src/lib/analytics";
import Discount from "@components/common/Discount";
import PriceTwo from "@components/common/PriceTwo";
import Rating from "@components/common/Rating";
import useUtilsFunction from "@hooks/useUtilsFunction";
// Lazy-load ProductModal — only loaded when user opens quick-view
const ProductModal = dynamic(
  () => import("@components/modal/ProductModal"),
  { ssr: false }
);
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { useSetting } from "@context/SettingContext";

const DiscountedCard = ({ product, attributes, currency }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { showingTranslateValue, getNumber } = useUtilsFunction();
  const { globalSetting } = useSetting();

  // Resolve variant display names from attribute data
  const variantOptions = useMemo(() => {
    if (!product?.variants?.length || !attributes?.length) return [];

    const internalFields = new Set([
      'originalPrice', 'price', 'discount', 'quantity',
      'barcode', 'sku', 'productId', 'image', '_id',
      'id', 'stock', 'createdAt', 'updatedAt', '__v',
    ]);

    const options = product.variants.map((variant, idx) => {
      const attrKeys = Object.keys(variant).filter(k => !internalFields.has(k));
      const labels = attrKeys.map(attId => {
        const att = attributes.find(a => a._id === attId);
        if (!att) return null;
        const val = att.variants?.find(v => v._id === variant[attId]);
        return val ? showingTranslateValue(val.name) : null;
      }).filter(Boolean);

      return {
        idx,
        label: labels.join(' / ') || `Opción ${idx + 1}`,
        price: getNumber(variant.price),
        originalPrice: getNumber(variant.originalPrice),
        quantity: variant.quantity || 0,
        variant,
      };
    });

    const seen = new Set();
    return options.filter(o => {
      if (seen.has(o.label)) return false;
      seen.add(o.label);
      return true;
    });
  }, [product?.variants, attributes]);

  const displayPrice = useMemo(() => {
    if (variantOptions.length > 0 && variantOptions[selectedVariantIdx]) {
      return variantOptions[selectedVariantIdx].price;
    }
    return product?.isCombination
      ? product?.variants?.[0]?.price
      : product?.prices?.price;
  }, [selectedVariantIdx, variantOptions, product]);

  const displayOriginalPrice = useMemo(() => {
    if (variantOptions.length > 0 && variantOptions[selectedVariantIdx]) {
      return variantOptions[selectedVariantIdx].originalPrice;
    }
    return product?.isCombination
      ? product?.variants?.[0]?.originalPrice
      : product?.prices?.originalPrice;
  }, [selectedVariantIdx, variantOptions, product]);

  // Image based on selected variant
  const displayImage = useMemo(() => {
    if (variantOptions.length > 0 && variantOptions[selectedVariantIdx]?.variant?.image) {
      return variantOptions[selectedVariantIdx].variant.image;
    }
    return product?.image?.[0];
  }, [selectedVariantIdx, variantOptions, product?.image]);

  // Discount percentage based on selected variant
  const displayDiscount = useMemo(() => {
    if (displayOriginalPrice > 0 && displayPrice < displayOriginalPrice) {
      return Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100);
    }
    return 0;
  }, [displayPrice, displayOriginalPrice]);

  const handleAddItem = (p) => {
    if (p.stock < 1) return notifyError("Stock no válido!");

    if (p?.variants?.length > 0) {
      setModalOpen(!modalOpen);
      return;
    }
    const { slug, variants, categories, description, ...updatedProduct } =
      product;
    const newItem = {
      ...updatedProduct,
      title: showingTranslateValue(p?.title),
      id: p._id,
      variant: p.prices,
      price: p.prices.price,
      originalPrice: product.prices?.originalPrice,
    };
    addItem(newItem);
  };

  const handleModalOpen = (event, id) => {
    setModalOpen(event);
  };

  return (
    <>
      {modalOpen && (
        <ProductModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          product={product}
          attributes={attributes}
          globalSetting={globalSetting}
        />
      )}

      <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-white border-gray-100 transition-all duration-100 ease-in-out hover:border-kachabazar-500 ">
        <div className="w-full flex justify-between">
          <Discount product={product} discount={displayDiscount} />
        </div>
        <div className="relative w-full min-h-48 lg:h-48 xl:h-52">
          <Link
            href={`/product/${product?.slug}`}
            className="relative block w-full h-full overflow-hidden bg-gray-100"
          >
            <ImageWithFallback
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
              alt="product"
              src={displayImage}
            />
          </Link>
          <div className="absolute lg:bottom-0 bottom-4 lg:group-hover:bottom-4 inset-x-1 opacity-100 flex justify-center lg:opacity-0 lg:invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button
              aria-label="quick view"
              onClick={() => {
                handleModalOpen(!modalOpen, product._id);
                handleLogEvent(
                  "product",
                  `opened ${showingTranslateValue(
                    product?.title
                  )} product modal`
                );
              }}
              className="relative h-auto inline-flex items-center cursor-pointer justify-center rounded-full transition-colors text-xs py-2 px-4 bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:text-kachabazar-500 hover:bg-gray-100 dark:hover:bg-slate-800 shadow-lg focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-kachabazar-600 dark:focus:ring-offset-0"
            >
              <IoExpand />
              <span className="ms-1 hidden xl:block lg:block">Vista Rápida</span>
            </button>
          </div>
          <div className="absolute bottom-3 right-3 z-10 flex items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all duration-300 ease-in-out hover:bg-gray-100 hover:text-kachabazar-500">
            {inCart(product._id) ? (
              <div>
                {items.map(
                  (item) =>
                    item.id === product._id && (
                      <div
                        key={item.id}
                        className="flex flex-col w-11 h-22 items-center p-1 justify-between bg-kachabazar-500 text-white ring-2 ring-white rounded-full"
                      >
                        <button
                          onClick={() =>
                            updateItemQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <span className="text-xl cursor-pointer">
                            <IoRemove />
                          </span>
                        </button>
                        <p className="text-sm px-1 font-medium">
                          {item.quantity}
                        </p>
                        <button
                          onClick={() =>
                            item?.variants?.length > 0
                              ? handleAddItem(item)
                              : handleIncreaseQuantity(item)
                          }
                        >
                          <span className="text-lg cursor-pointer">
                            <IoAdd />
                          </span>
                        </button>
                      </div>
                    )
                )}{" "}
              </div>
            ) : (
              <button
                onClick={() => handleAddItem(product)}
                aria-label="cart"
                className="w-11 h-11 flex items-center justify-center rounded-full cursor-pointer border-2 bg-kachabazar-500 text-white border-gray-10 font-medium transition-colors duration-300 hover:border-accent hover:bg-kachabazar-600 hover:border-kachabazar-600 hover:text-gray-50 focus:border-kachabazar-500 focus:bg-kachabazar-500 focus:text-gray-50"
              >
                {" "}
                <IoBagAdd className="text-xl" />
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col space-y-2 px-4 pt-2 pb-8">
          <div className="relative mb-1">
            <Link
              href={`/product/${product?.slug}`}
              className="text-sm font-medium text-gray-800 line-clamp-1 hover:text-kachabazar-500"
            >
              {showingTranslateValue(product?.title)}
            </Link>
          </div>

          {/* Variant pills */}
          {variantOptions.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {variantOptions.map((opt, idx) => (
                <button
                  key={opt.idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantIdx(idx);
                  }}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all duration-200 cursor-pointer ${
                    selectedVariantIdx === idx
                      ? "bg-kachabazar-500 text-white border-kachabazar-500 shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-kachabazar-300 hover:bg-kachabazar-50 hover:text-kachabazar-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-0.5 items-center">
            <Rating
              size="md"
              showReviews={true}
              rating={product?.average_rating}
              totalReviews={product?.total_reviews}
            />
          </div>

          <div className="flex items-center justify-between">
            <PriceTwo
              card
              product={product}
              currency={currency}
              price={displayPrice}
              originalPrice={displayOriginalPrice}
            />
            <span className="text-[10px] text-gray-400">
              {(variantOptions.length > 0 ? variantOptions[selectedVariantIdx]?.quantity : product?.stock) > 0
                ? `Stock: ${variantOptions.length > 0 ? variantOptions[selectedVariantIdx]?.quantity : product?.stock}`
                : <span className="text-red-500">Agotado</span>}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(DiscountedCard), {
  ssr: false,
});
