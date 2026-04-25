import Link from "next/link";
import { useCart } from "react-use-cart";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

//internal import
import useAddToCart from "@hooks/useAddToCart";
import ImageWithFallback from "@components/common/ImageWithFallBack";

const CartItem = ({ item, currency }) => {
  const { updateItemQuantity, removeItem } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();

  // console.log("item>>", item);

  return (
    <div className="group w-full h-auto flex justify-start items-center px-3 py-4 transition-all relative border-b border-gray-200 last:border-b-0">
      <div className="relative flex overflow-hidden flex-shrink-0 cursor-pointer mr-3">
        <ImageWithFallback
          img
          width={40}
          height={40}
          src={item.image}
          alt={item.title}
          className="size-16 flex-none rounded-md bg-gray-100 object-cover"
        />
      </div>
      <div className="flex flex-col w-full overflow-hidden min-w-0">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/product/${item.slug}`}
              className="truncate text-sm font-medium text-gray-700 text-heading line-clamp-1 block"
            >
              {item.title}
            </Link>
            <span className="text-xs text-gray-400 mb-1">
              Precio unitario:{" "}
              {item.originalPrice && item.originalPrice > item.price ? (
                <>
                  <span className="line-through text-gray-400 mr-1">
                    {currency}{item.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-orange-500 font-semibold">
                    {currency}{item.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span>{currency}{item.price.toFixed(2)}</span>
              )}
            </span>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="flex-shrink-0 p-1 hover:text-red-600 text-red-400 text-base cursor-pointer hover:bg-red-50 rounded transition-colors"
          >
            <FiTrash2 />
          </button>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="font-bold text-teal-600 hover:text-teal-700 text-sm text-heading leading-5">
            <span>
              {currency}
              {(item.price * item.quantity).toFixed(2)}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="ml-2 inline-block text-[10px] bg-orange-100 text-orange-600 font-semibold px-1.5 py-0.5 rounded">
                -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
              </span>
            )}
          </div>

          <div className="h-8 w-24 flex items-center justify-between px-2 border border-gray-200 bg-white text-gray-600 rounded-full shadow-sm">
            <button
              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
              className="flex items-center justify-center w-5 h-5 cursor-pointer hover:text-kachabazar-600 transition-colors"
            >
              <FiMinus className="text-sm" />
            </button>
            <p className="text-sm font-semibold text-dark min-w-[1.25rem] text-center">
              {item.quantity}
            </p>
            <button
              onClick={() => handleIncreaseQuantity(item)}
              className="flex items-center justify-center w-5 h-5 cursor-pointer hover:text-kachabazar-600 transition-colors"
            >
              <FiPlus className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
