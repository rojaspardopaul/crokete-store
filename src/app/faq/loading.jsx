export default function Loading() {
  const shimmer =
    "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-200/60 before:to-transparent";

  return (
    <div className="bg-white animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gray-50 py-14 sm:py-18 lg:py-22">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
          <div className={`h-6 w-36 mx-auto rounded-full bg-gray-200 ${shimmer}`} />
          <div className={`h-10 w-72 mx-auto rounded bg-gray-200 ${shimmer}`} />
          <div className="space-y-2 pt-2">
            <div className={`h-4 w-full max-w-md mx-auto rounded bg-gray-200 ${shimmer}`} />
            <div className={`h-4 w-3/5 mx-auto rounded bg-gray-200 ${shimmer}`} />
          </div>
        </div>
      </div>

      {/* Category nav skeleton */}
      <div className="border-b border-gray-100 py-6">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-gray-100">
              <div className={`w-10 h-10 rounded-lg bg-gray-200 ${shimmer}`} />
              <div className={`h-4 w-20 rounded bg-gray-200 ${shimmer}`} />
            </div>
          ))}
        </div>
      </div>

      {/* FAQ sections skeleton */}
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-14">
        {[...Array(4)].map((_, catIdx) => (
          <div key={catIdx}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg bg-gray-200 ${shimmer}`} />
              <div className={`h-6 w-40 rounded bg-gray-200 ${shimmer}`} />
            </div>
            {/* Accordion items */}
            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-5 sm:px-6 py-4 sm:py-5 space-y-2">
                  <div className={`h-4 w-4/5 rounded bg-gray-200 ${shimmer}`} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA skeleton */}
      <div className="bg-gray-300 py-14 sm:py-18">
        <div className="text-center max-w-2xl mx-auto px-4 space-y-4">
          <div className={`h-8 w-64 mx-auto rounded bg-gray-400/40 ${shimmer}`} />
          <div className={`h-4 w-80 mx-auto rounded bg-gray-400/30 ${shimmer}`} />
          <div className="flex gap-3 justify-center pt-4">
            <div className={`h-12 w-44 rounded-lg bg-gray-400/40 ${shimmer}`} />
            <div className={`h-12 w-44 rounded-lg bg-gray-400/30 ${shimmer}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
