export default function Loading() {
  const shimmer =
    "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-200/60 before:to-transparent";

  return (
    <div className="bg-white animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gray-50 py-16 sm:py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <div className={`h-6 w-48 mx-auto rounded-full bg-gray-200 ${shimmer}`} />
          <div className={`h-10 w-full max-w-md mx-auto rounded bg-gray-200 ${shimmer}`} />
          <div className={`h-10 w-2/3 mx-auto rounded bg-gray-200 ${shimmer}`} />
          <div className="space-y-2 pt-2">
            <div className={`h-4 w-full max-w-lg mx-auto rounded bg-gray-200 ${shimmer}`} />
            <div className={`h-4 w-4/5 mx-auto rounded bg-gray-200 ${shimmer}`} />
          </div>
          <div className="flex gap-3 justify-center pt-4">
            <div className={`h-12 w-36 rounded-lg bg-gray-200 ${shimmer}`} />
            <div className={`h-12 w-36 rounded-lg bg-gray-200 ${shimmer}`} />
          </div>
        </div>
      </div>

      {/* Stats bar skeleton */}
      <div className="bg-gray-300 py-8 sm:py-10">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <div className={`h-8 w-16 mx-auto rounded bg-gray-400/40 ${shimmer}`} />
              <div className={`h-3 w-24 mx-auto rounded bg-gray-400/30 ${shimmer}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Historia skeleton */}
      <div className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className={`h-5 w-32 rounded-full bg-gray-200 ${shimmer}`} />
            <div className={`h-8 w-3/4 rounded bg-gray-200 ${shimmer}`} />
            <div className="space-y-2 pt-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`h-4 rounded bg-gray-200 ${shimmer}`} style={{ width: `${85 + Math.random() * 15}%` }} />
              ))}
            </div>
          </div>
          <div className={`aspect-[4/3] rounded-2xl bg-gray-200 ${shimmer}`} />
        </div>
      </div>

      {/* Compromiso skeleton */}
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <div className={`h-5 w-40 mx-auto rounded-full bg-gray-200 ${shimmer}`} />
            <div className={`h-8 w-64 mx-auto rounded bg-gray-200 ${shimmer}`} />
            <div className={`h-4 w-80 mx-auto rounded bg-gray-200 ${shimmer}`} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 space-y-3">
                <div className={`h-12 w-12 rounded-lg bg-gray-200 ${shimmer}`} />
                <div className={`h-5 w-3/4 rounded bg-gray-200 ${shimmer}`} />
                <div className="space-y-1.5">
                  <div className={`h-3 w-full rounded bg-gray-200 ${shimmer}`} />
                  <div className={`h-3 w-5/6 rounded bg-gray-200 ${shimmer}`} />
                  <div className={`h-3 w-4/6 rounded bg-gray-200 ${shimmer}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust section skeleton */}
      <div className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className={`h-5 w-28 rounded-full bg-gray-200 ${shimmer}`} />
            <div className={`h-8 w-48 rounded bg-gray-200 ${shimmer}`} />
            <div className="space-y-2">
              <div className={`h-4 w-full rounded bg-gray-200 ${shimmer}`} />
              <div className={`h-4 w-5/6 rounded bg-gray-200 ${shimmer}`} />
            </div>
            <div className={`h-28 rounded-xl bg-gray-200 ${shimmer}`} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-5 rounded-xl bg-white border border-gray-100 space-y-2">
                <div className={`h-6 w-6 rounded bg-gray-200 ${shimmer}`} />
                <div className={`h-4 w-3/4 rounded bg-gray-200 ${shimmer}`} />
                <div className={`h-3 w-full rounded bg-gray-200 ${shimmer}`} />
                <div className={`h-3 w-4/5 rounded bg-gray-200 ${shimmer}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA skeleton */}
      <div className="bg-gray-300 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto px-4 space-y-4">
          <div className={`h-8 w-72 mx-auto rounded bg-gray-400/40 ${shimmer}`} />
          <div className={`h-4 w-80 mx-auto rounded bg-gray-400/30 ${shimmer}`} />
          <div className="flex gap-3 justify-center pt-4">
            <div className={`h-12 w-40 rounded-lg bg-gray-400/40 ${shimmer}`} />
            <div className={`h-12 w-40 rounded-lg bg-gray-400/30 ${shimmer}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
