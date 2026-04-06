"use client";

import { useState } from "react";

const Tooltip = ({ children, text }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative inline-flex">
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="cursor-help"
        tabIndex={0}
      >
        {children}
      </span>
      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-52 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
};

const PackageInfoBar = ({ packageInfo, price }) => {
  if (!packageInfo?.weight) return null;

  const unit = packageInfo.unit || "kg";
  const pricePerUnit =
    packageInfo.weight > 0 && price > 0
      ? (price / packageInfo.weight).toFixed(2)
      : null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Peso */}
      <Tooltip text={`Contenido neto de este empaque: ${packageInfo.weight}${unit}`}>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-3m6 3l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-3m0-3v3" />
          </svg>
          {packageInfo.weight}{unit}
        </span>
      </Tooltip>

      {/* Precio por unidad */}
      {pricePerUnit && (
        <Tooltip text={`Precio relativo: pagas $${pricePerUnit} por cada ${unit}. Útil para comparar presentaciones`}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ${pricePerUnit}/{unit}
          </span>
        </Tooltip>
      )}
    </div>
  );
};

export default PackageInfoBar;

