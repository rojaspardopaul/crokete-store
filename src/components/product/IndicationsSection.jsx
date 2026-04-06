const IndicationsSection = ({ indications, warnings, dosage, showingTranslateValue }) => {
  const hasIndications = indications && showingTranslateValue(indications);
  const hasWarnings = warnings && showingTranslateValue(warnings);
  const hasDosage = dosage && showingTranslateValue(dosage);

  if (!hasIndications && !hasWarnings && !hasDosage) return null;

  return (
    <div className="mb-6 space-y-4">
      {hasIndications && (
        <div>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {showingTranslateValue(indications)}
          </p>
        </div>
      )}

      {hasDosage && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Dosificación
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {showingTranslateValue(dosage)}
          </p>
        </div>
      )}

      {hasWarnings && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-amber-800 mb-1">
            ⚠️ Advertencias
          </h4>
          <p className="text-sm text-amber-700 leading-relaxed whitespace-pre-line">
            {showingTranslateValue(warnings)}
          </p>
        </div>
      )}
    </div>
  );
};

export default IndicationsSection;
