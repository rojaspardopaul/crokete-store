import React from "react";

/**
 * PawIcon - Huellita de perro SVG para calificaciones
 * Reemplaza las estrellas genéricas con un ícono temático de mascota
 */
const PawIcon = ({ className = "", filled = false }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={filled ? "0" : "1.5"}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Almohadilla central */}
    <path d="M12 17.5c-2.5 0-4.5-1.5-4.5-3.5s2-4 4.5-4 4.5 2 4.5 4-2 3.5-4.5 3.5z" />
    {/* Dedo superior izquierdo */}
    <ellipse cx="7.5" cy="7" rx="2" ry="2.5" />
    {/* Dedo superior derecho */}
    <ellipse cx="16.5" cy="7" rx="2" ry="2.5" />
    {/* Dedo lateral izquierdo */}
    <ellipse cx="5" cy="11.5" rx="1.8" ry="2.3" />
    {/* Dedo lateral derecho */}
    <ellipse cx="19" cy="11.5" rx="1.8" ry="2.3" />
  </svg>
);

const Rating = ({
  rating = 4.5,
  totalReviews = 128,
  size = "sm",
  showReviews = true,
}) => {
  const fullPaws = Math.floor(rating);
  const hasHalfPaw = rating % 1 !== 0;
  const emptyPaws = 5 - fullPaws - (hasHalfPaw ? 1 : 0);

  const pawSize =
    size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : size === "sm" ? "w-3.5 h-3.5" : "w-3 h-3";
  const textSize =
    size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className="flex items-center gap-0.5">
      <div className="flex items-center gap-px">
        {/* Huellitas llenas */}
        {[...Array(fullPaws)].map((_, index) => (
          <PawIcon
            key={`full-${index}`}
            className={`${pawSize} text-amber-500`}
            filled={true}
          />
        ))}

        {/* Media huellita */}
        {hasHalfPaw && (
          <div className="relative">
            <PawIcon className={`${pawSize} text-gray-200`} filled={true} />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: "50%" }}
            >
              <PawIcon className={`${pawSize} text-amber-500`} filled={true} />
            </div>
          </div>
        )}

        {/* Huellitas vacías */}
        {[...Array(emptyPaws)].map((_, index) => (
          <PawIcon
            key={`empty-${index}`}
            className={`${pawSize} text-gray-200`}
            filled={true}
          />
        ))}
      </div>

      {showReviews && (
        <span className="ml-1 text-[11px] leading-none flex items-center gap-0.5">
          <span className="font-semibold text-amber-600">{parseFloat(rating).toFixed(1)}</span>
          <span className="text-gray-400">({totalReviews})</span>
        </span>
      )}
    </div>
  );
};

export default Rating;
