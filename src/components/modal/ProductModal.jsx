import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  Headphones,
  Minus,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";

//internal import
import Price from "@components/common/Price";
import Tags from "@components/common/Tags";
import useAddToCart from "@hooks/useAddToCart";
import Discount from "@components/common/Discount";
import VariantList from "@components/variants/VariantList";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Rating from "@components/common/Rating";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import Stock from "@components/common/Stock";
import useProductAction from "@hooks/useProductAction";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import {
  FiEye,
  FiHeadphones,
  FiMinus,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa6";
import MainModal from "./MainModal";
import ProductGallery from "@components/product/ProductGallery";
import WhatsAppButton from "@components/button/WhatsAppButton";

const ProductModal = ({
  product,
  modalOpen,
  attributes,
  setModalOpen,
  globalSetting,
}) => {
  const { getNumberTwo, showingTranslateValue } = useUtilsFunction();
  const currency = globalSetting?.default_currency || "$";

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
  const { item, setItem, totalItems, handleAddItem, handleIncreaseQuantity } =
    useAddToCart();
  const {
    // state
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
    selectVa,
    setSelectVa,
    variantTitle,
    variants,
    category_name,

    // actions
    handleAddToCart,
    handleMoreInfo,
  } = useProductAction({
    product,
    attributes,
    globalSetting,
    onCloseModal: () => setModalOpen(false),
    withRouter: true,
  });

  return (
    <>
      <MainModal
        modalOpen={modalOpen}
        bottomCloseBtn={false}
        handleCloseModal={() => setModalOpen(false)}
      >
        <div className="inline-block overflow-y-auto h-full align-middle transition-all transform">
          <div className="lg:flex flex-col lg:flex-row md:flex-row w-full max-w-4xl overflow-hidden">
            <div className="w-full lg:w-[40%]">
              <ProductGallery
                images={allImages}
                selectedImage={selectedImage}
                onImageChange={setSelectedImage}
                size="md"
                enableZoom={false}
              />
            </div>

            <div className="w-full lg:w-[60%] pt-6 lg:pt-0 lg:pl-7 xl:pl-10">
              <div className="mb-2 md:mb-2.5 block -mt-1.5">
                <Link href={`/product/${product.slug}`}>
                  <h2
                    onClick={() => setModalOpen(false)}
                    className="text-heading text-lg md:text-xl lg:text-xl font-medium hover:text-black cursor-pointer"
                  >
                    {showingTranslateValue(product?.title)}
                  </h2>
                </Link>
                <div className="flex gap-0.5 items-center mt-1">
                  {/* Rating */}
                  <Rating
                    size="md"
                    showReviews={true}
                    rating={product?.average_rating}
                    totalReviews={product?.total_reviews}
                  />
                </div>
              </div>
              <p className="text-sm leading-6 text-gray-500 md:leading-6">
                {showingTranslateValue(product?.description)}
              </p>
              <div className="flex items-center my-4">
                <Price
                  price={price}
                  product={product}
                  currency={currency}
                  originalPrice={originalPrice}
                />
                <span className="ml-2">
                  <Discount slug product={product} discount={discount} />
                </span>
              </div>

              {variantTitle?.length > 0 && (
                <div className="mb-4 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
                  <h3 className="text-xs font-medium text-gray-500 mb-2">Elige tu opción</h3>
                  {variantTitle.map((a, i) => (
                    <div key={a._id} className={`${i > 0 ? 'mt-3 pt-3 border-t border-gray-200' : ''}`}>
                      <h4 className="text-sm py-1 text-gray-800 font-medium mb-1">
                        {showingTranslateValue(a?.name)}:
                      </h4>
                      <VariantList
                        att={a._id}
                        option={a.option}
                        setValue={setValue}
                        varTitle={variantTitle}
                        variants={product?.variants}
                        setSelectVa={setSelectVa}
                        selectVariant={selectVariant}
                        setSelectVariant={setSelectVariant}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 space-y-3">
                {/* Row 1: Quantity + Stock */}
                <div className="flex items-center gap-3">
                  <div className="group flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border border-gray-300">
                    <button
                      onClick={() => setItem(item - 1)}
                      disabled={item === 1}
                      className="flex items-center cursor-pointer justify-center py-2 px-3 h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-10 text-heading border-e border-gray-300 hover:text-gray-500"
                    >
                      <span className="text-dark text-xl">
                        <FiMinus />
                      </span>
                    </button>
                    <p className="font-semibold text-sm px-4">{item}</p>
                    <button
                      onClick={() => setItem(item + 1)}
                      disabled={
                        product.quantity < item || product.quantity === item
                      }
                      className="flex items-center cursor-pointer justify-center py-2 px-3 h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-10 text-heading border-s border-gray-300 hover:text-gray-500"
                    >
                      <span className="text-dark text-xl">
                        <FiPlus />
                      </span>
                    </button>
                  </div>
                  <Stock stock={stock} />
                </div>

                {/* Row 2: Add to cart + View details */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddToCart(product, item)}
                    disabled={product.quantity < 1}
                    className="w-full text-sm flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none text-white py-2.5 px-4 hover:text-white bg-kachabazar-500 hover:bg-kachabazar-600"
                  >
                    <FiShoppingBag className="mr-1.5" />
                    Agregar
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    passHref
                    className="w-full relative h-auto flex items-center font-semibold text-sm text-gray-600 justify-center rounded-md transition-colors py-2.5 px-4 bg-gray-100 hover:bg-gray-200"
                  >
                    <FiEye className="mr-1.5" />
                    Ver detalles
                  </Link>
                </div>

                {/* Row 3: WhatsApp */}
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
                  className="text-sm py-2.5 px-4"
                />
              </div>
              <div className="flex items-center mt-4">
                <div className="flex items-center justify-between space-s-3 sm:space-s-4 w-full">
                  <div>
                    <span className=" font-semibold py-1 text-sm d-block">
                      <span className="text-gray-700">Categoría</span>{" "}
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
            </div>
          </div>
        </div>
      </MainModal>
    </>
  );
};

export default ProductModal;
