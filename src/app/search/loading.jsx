import ProductGridSkeleton from "@components/preloader/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-10 py-6">
      {/* Filters skeleton */}
      <div className="flex gap-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      {/* Product grid skeleton */}
      <ProductGridSkeleton count={12} />
    </div>
  );
}
