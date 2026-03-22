/**
 * ProductCardSkeleton — matches the visual shape of ProductCard
 * for a seamless loading experience without layout shift (CLS ≈ 0).
 */
const ProductCardSkeleton = () => {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border bg-white border-gray-100 shadow-sm animate-pulse">
      {/* Image placeholder */}
      <div className="relative w-full min-h-48 lg:h-48 xl:h-56 bg-gray-100" />

      {/* Content placeholder */}
      <div className="flex flex-1 flex-col gap-2 px-4 pt-3 pb-4">
        {/* Title lines */}
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-8 bg-gray-100 rounded" />
        </div>

        {/* Price */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
};

/**
 * ProductGridSkeleton — a grid of product card skeletons
 * matching the responsive grid layout of the product sections.
 */
const ProductGridSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export { ProductCardSkeleton, ProductGridSkeleton };
export default ProductGridSkeleton;
