import RationCalculator from "@components/product/RationCalculator";

const ConsumptionGuideCard = ({ consumptionGuide, packageInfo, effectivePackageInfo, nutritionTable, petCompatibility, productId }) => {
  if (!consumptionGuide?.length) return null;

  // Usa el peso efectivo (variante seleccionada) si está disponible, si no el del producto base
  const activeWeight = effectivePackageInfo?.weight ?? packageInfo?.weight ?? null;
  const activeUnit = effectivePackageInfo?.unit ?? packageInfo?.unit ?? "kg";

  // Convierte el peso a gramos para el cálculo
  const packageGrams = activeWeight
    ? (activeUnit === "g" ? activeWeight : activeWeight * 1000)
    : null;

  return (
    <>
    <div className="mb-6 rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-gray-500">
          Duración estimada por peso de tu mascota
        </p>
        {activeWeight && (
          <span className="text-xs font-semibold text-kachabazar-700 bg-kachabazar-50 border border-kachabazar-100 rounded-full px-2.5 py-0.5">
            Bolsa de {activeWeight}{activeUnit}
          </span>
        )}
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 bg-white px-4 py-2 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Mascota</span>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide text-center">Ración/día</span>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Duración</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {consumptionGuide.map((row, i) => {
          // Recalcular días dinámicamente si tenemos el peso del paquete
          const effectiveDays = packageGrams && row.dailyAmount > 0
            ? Math.round(packageGrams / row.dailyAmount)
            : row.durationDays;

          return (
            <div
              key={i}
              className="grid grid-cols-3 items-center px-4 py-2.5 text-sm"
            >
              <span className="text-gray-700">
                <span className="font-semibold">{row.petWeight}</span>
                <span className="text-gray-400 text-xs"> kg</span>
              </span>
              <span className="text-center text-gray-600">
                {row.dailyAmount}
                <span className="text-gray-400 text-xs"> g/día</span>
              </span>
              <span className="text-right">
                {effectiveDays ? (
                  <span className="inline-flex items-center justify-end gap-1">
                    <span className="font-semibold text-kachabazar-600">~{effectiveDays}</span>
                    <span className="text-gray-400 text-xs">días</span>
                  </span>
                ) : (
                  <span className="text-gray-300 text-xs">—</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>

    {/* Ration Calculator */}
    <RationCalculator
      consumptionGuide={consumptionGuide}
      effectivePackageInfo={effectivePackageInfo}
      nutritionTable={nutritionTable}
      petCompatibility={petCompatibility}
      productId={productId}
    />
  </>
  );
};

export default ConsumptionGuideCard;

