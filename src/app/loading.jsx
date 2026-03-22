import ProductGridSkeleton from "@components/preloader/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-crokete-cream-50 dark:bg-zinc-900">
      {/* Hero carousel skeleton */}
      <div className="bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5">
          <div className="flex flex-col lg:flex-row w-full gap-3 lg:gap-5">
            <div className="w-full lg:w-3/5">
              <div className="aspect-[2.5/1] lg:h-72 animate-pulse rounded-2xl bg-gray-200" />
            </div>
            <div className="w-full lg:w-2/5 flex flex-col gap-3">
              <div className="flex-1 min-h-[120px] animate-pulse rounded-2xl bg-gray-200" />
              <div className="h-16 animate-pulse rounded-2xl bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Products section skeleton */}
      <div className="pt-4 sm:pt-6 lg:pt-8 pb-6 sm:pb-8 lg:pb-10 mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-10">
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-4" />
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}
