const QuickBenefits = ({ benefits, features, showingTranslateValue }) => {
  const hasBenefits = benefits && showingTranslateValue(benefits);
  const hasFeatures = features && showingTranslateValue(features);

  if (!hasBenefits && !hasFeatures) return null;

  return (
    <div className="mb-6 space-y-4">
      {hasBenefits && (
        <div>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {showingTranslateValue(benefits)}
          </p>
        </div>
      )}
      {hasFeatures && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Características
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {showingTranslateValue(features)}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickBenefits;
