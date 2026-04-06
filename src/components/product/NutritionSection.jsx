const NutritionSection = ({ nutritionTable, showingTranslateValue, ingredients, feedingGuide }) => {
  const hasNutrition = nutritionTable?.guaranteedAnalysis?.length > 0;
  const hasIngredients = ingredients && showingTranslateValue(ingredients);
  const hasFeedingGuide = feedingGuide && showingTranslateValue(feedingGuide);

  if (!hasNutrition && !hasIngredients && !hasFeedingGuide) return null;

  return (
    <div className="mb-6 space-y-4">
      {hasIngredients && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Ingredientes
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {showingTranslateValue(ingredients)}
          </p>
        </div>
      )}

      {hasNutrition && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Análisis garantizado
          </h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">
                    Nutriente
                  </th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-gray-500">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {nutritionTable.guaranteedAnalysis.map((row, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-gray-700">{row.nutrient}</td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {row.value}
                      {row.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {nutritionTable.calories && (
              <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
                <span className="font-medium">Calorías:</span>{" "}
                {nutritionTable.calories}
              </div>
            )}
          </div>
        </div>
      )}

      {/* {hasFeedingGuide && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Guía de alimentación
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {showingTranslateValue(feedingGuide)}
          </p>
        </div>
      )} */}
    </div>
  );
};

export default NutritionSection;
