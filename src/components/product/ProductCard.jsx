"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  IoAdd,
  IoRemove,
  IoExpand,
  IoBagAdd,
} from "react-icons/io5";
import { useCart } from "react-use-cart";
import Link from "next/link";
import dynamic from "next/dynamic";

//internal import
import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import { notifyError } from "@utils/toast";
import Rating from "@components/common/Rating";
import useAddToCart from "@hooks/useAddToCart";
import { useSetting } from "@context/SettingContext";
import Discount from "@components/common/Discount";
import LoyaltyPointsBadge from "@components/loyalty/LoyaltyPointsBadge";
import { handleLogEvent } from "src/lib/analytics";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductModal from "@components/modal/ProductModal";
import ImageWithFallback from "@components/common/ImageWithFallBack";

const ProductCard = ({ product, attributes }) => {
  const modalRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const { globalSetting } = useSetting();

  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { showingTranslateValue, getNumber } = useUtilsFunction();

  const currency = globalSetting?.default_currency || "$";

  // Resolve variant display names from attribute data
  const variantOptions = useMemo(() => {
    if (!product?.variants?.length || !attributes?.length) return [];

    // Find which attribute keys are used in variants (excluding internal fields)
    const internalFields = new Set([
      'originalPrice', 'price', 'discount', 'quantity',
      'barcode', 'sku', 'productId', 'image', '_id',
      'id', 'stock', 'createdAt', 'updatedAt', '__v',
    ]);

    // Get unique variants with their display names
    const options = product.variants.map((variant, idx) => {
      const attrKeys = Object.keys(variant).filter(k => !internalFields.has(k));
      // Build display label from attribute names
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

    // Deduplicate by label
    const seen = new Set();
    return options.filter(o => {
      if (seen.has(o.label)) return false;
      seen.add(o.label);
      return true;
    });
  }, [product?.variants, attributes]);

  // Current display price based on selected variant
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
    // Animación al agregar
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 600);
  };

  const handleModalOpen = (event, id) => {
    setModalOpen(event);
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setModalOpen]);

  return (
    <>
      {modalOpen && (
        <ProductModal
          product={product}
          modalOpen={modalOpen}
          attributes={attributes}
          globalSetting={globalSetting}
          setModalOpen={setModalOpen}
        />
      )}

      <div className={`group product-card-hover relative flex flex-col overflow-hidden rounded-2xl border bg-white border-kachabazar-100 shadow-sm ${addedAnimation ? "animate-cart-bounce" : ""}`}>
        {/* Badge de descuento */}
        <div className="w-full flex justify-between">
          <Discount product={product} discount={displayDiscount} />
        </div>

        {/* Imagen del producto */}
        <div className="relative w-full min-h-48 lg:h-48 xl:h-56">
          <Link
            href={`/product/${product?.slug}`}
            className="relative block w-full h-full overflow-hidden bg-crokete-cream-50"
          >
            <ImageWithFallback
              fill
              sizes="100%"
              alt="product"
              src={displayImage}
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Quick view overlay */}
          <div className="absolute lg:bottom-0 bottom-4 lg:group-hover:bottom-4 inset-x-1 opacity-100 flex justify-center lg:opacity-0 lg:invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <button
              aria-label="Vista rápida"
              onClick={() => {
                handleModalOpen(!modalOpen, product._id);
                handleLogEvent(
                  "product",
                  `opened ${showingTranslateValue(product?.title)} product modal`
                );
              }}
              className="relative h-auto inline-flex items-center cursor-pointer justify-center rounded-full transition-all text-xs py-2 px-4 bg-white/90 backdrop-blur-sm text-kachabazar-800 hover:bg-kachabazar-500 hover:text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-kachabazar-500"
            >
              <IoExpand />
              <span className="ms-1 hidden xl:block lg:block">Vista Rápida</span>
            </button>
          </div>

          {/* Add to cart button */}
          <div className="absolute bottom-3 right-3 z-10">
            {inCart(product._id) ? (
              <div>
                {items.map(
                  (item) =>
                    item.id === product._id && (
                      <div
                        key={item.id}
                        className="flex flex-col w-11 h-22 items-center p-1 justify-between bg-kachabazar-500 text-white ring-2 ring-white rounded-full shadow-lg"
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
                        <p className="text-sm px-1 font-bold">
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
                aria-label="Agregar al carrito"
                className="w-11 h-11 flex items-center justify-center rounded-full cursor-pointer bg-kachabazar-500 text-white shadow-lg transition-all duration-300 hover:bg-kachabazar-600 hover:scale-110 hover:shadow-xl focus:ring-2 focus:ring-kachabazar-500 focus:ring-offset-2 active:scale-95"
              >
                <IoBagAdd className="text-xl" />
              </button>
            )}
          </div>

          {/* Stock bajo indicator */}
          {product?.stock > 0 && product?.stock <= 5 && (
            <div className="absolute top-3 left-3 z-10 bg-kachabazar-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-soft-pulse">
              ¡Quedan {product.stock}!
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-1 flex-col gap-1.5 px-4 pt-3 pb-4">
          <Link
            href={`/product/${product?.slug}`}
            className="text-sm font-semibold text-crokete-earth-800 line-clamp-2 leading-snug hover:text-kachabazar-600 transition-colors"
          >
            {showingTranslateValue(product?.title)}
          </Link>

          {/* Variant pills - shown when product has variants */}
          {variantOptions.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
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

          <Rating
            size="sm"
            showReviews={true}
            rating={product?.average_rating}
            totalReviews={product?.total_reviews}
          />

          <LoyaltyPointsBadge price={displayPrice} size="sm" />

          <div className="mt-auto pt-1 flex items-center justify-between">
            <Price
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

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });
