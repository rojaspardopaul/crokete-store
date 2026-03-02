import useUtilsFunction from "@hooks/useUtilsFunction";

const Price = ({ product, price, card, originalPrice, currency }) => {
  const { getNumberTwo } = useUtilsFunction();

  // From "second design" logic
  const isCombo = product?.isCombination;
  const finalPrice = isCombo
    ? getNumberTwo(price)
    : getNumberTwo(product?.prices?.price);
  const baseOriginalPrice = getNumberTwo(originalPrice);
  const discountAmount = originalPrice > price ? originalPrice - price : 0;

  return (
    <>
      <div className="product-price font-bold flex items-baseline gap-2">
        <span
          className={`${
            card
              ? "inline-block text-lg font-extrabold text-kachabazar-700"
              : "inline-block text-2xl font-extrabold text-kachabazar-700"
          }`}
        >
          {currency}
          {finalPrice}
        </span>
        {discountAmount > 0 && (
          <del
            className={
              card
                ? "text-sm font-normal text-gray-400"
                : "text-base font-normal text-gray-400"
            }
          >
            {currency}
            {baseOriginalPrice}
          </del>
        )}
      </div>
    </>
  );
};

export default Price;
