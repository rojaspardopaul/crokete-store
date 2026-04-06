const PawIcon = ({ className = "", filled = false }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={filled ? "0" : "1.5"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 17.5c-2.5 0-4.5-1.5-4.5-3.5s2-4 4.5-4 4.5 2 4.5 4-2 3.5-4.5 3.5z" />
    <ellipse cx="7.5" cy="7" rx="2" ry="2.5" />
    <ellipse cx="16.5" cy="7" rx="2" ry="2.5" />
    <ellipse cx="5" cy="11.5" rx="1.8" ry="2.3" />
    <ellipse cx="19" cy="11.5" rx="1.8" ry="2.3" />
  </svg>
);

const BAR_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-amber-400",
  "bg-lime-400",
  "bg-green-500",
];

const ReviewDistribution = ({ reviews = [] }) => {
  const total = reviews.length;
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const idx = Math.round(r.rating) - 1;
    if (idx >= 0 && idx < 5) counts[idx]++;
  });

  if (total === 0) return null;

  return (
    <div className="space-y-1.5 mb-6">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = counts[star - 1];
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-0.5 w-14 justify-end">
              <span className="text-gray-600 font-medium">{star}</span>
              <PawIcon className="w-3.5 h-3.5 text-amber-500" filled />
            </div>
            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${BAR_COLORS[star - 1]} transition-all duration-300`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-10 text-right">
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewDistribution;
