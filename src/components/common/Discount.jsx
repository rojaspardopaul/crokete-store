import useUtilsFunction from "@hooks/useUtilsFunction";

const Discount = ({ discount, product, slug, modal }) => {
  const { getNumber } = useUtilsFunction();

  const price = product?.isCombination
    ? getNumber(product?.variants?.[0]?.price)
    : getNumber(product?.prices?.price);

  const originalPrice = product?.isCombination
    ? getNumber(product?.variants?.[0]?.originalPrice)
    : getNumber(product?.prices?.originalPrice);

  const discountPercentage =
    originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const badgeBase = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tracking-wide shadow-sm";
  const badgeColors = "bg-gradient-to-r from-red-500 to-red-600 text-white";

  const getClassName = (isModal, isSlug) => {
    if (isModal) return `absolute z-10 left-4 top-4 ${badgeBase} ${badgeColors}`;
    if (isSlug) return `${badgeBase} ${badgeColors}`;
    return `absolute z-10 left-3 top-3 ${badgeBase} ${badgeColors}`;
  };

  return (
    <>
      {discount > 1 && (
        <span className={getClassName(modal, slug)}>
          -{discount}%
        </span>
      )}
      {discount === undefined && discountPercentage > 1 && (
        <span className={getClassName(modal, slug)}>
          -{discountPercentage}%
        </span>
      )}
    </>
  );
};

export default Discount;
