import Rating from "@components/common/Rating";

const ReviewSummary = ({ reviews = [], onWriteReview }) => {
  const total = reviews.length;
  const avg =
    total > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total).toFixed(
          1
        )
      : 0;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <span className="text-4xl font-bold text-gray-900">{avg}</span>
          <p className="text-xs text-gray-500 mt-1">de 5</p>
        </div>
        <div>
          <Rating size="md" rating={Number(avg)} showReviews={false} />
          <p className="text-sm text-gray-500 mt-1">
            {total} {total === 1 ? "reseña" : "reseñas"}
          </p>
        </div>
      </div>

      {onWriteReview && (
        <button
          onClick={onWriteReview}
          className="px-4 py-2 text-sm font-medium bg-kachabazar-500 text-white rounded-lg hover:bg-kachabazar-600 transition-colors"
        >
          Escribir reseña
        </button>
      )}
    </div>
  );
};

export default ReviewSummary;
