const TechnicalSpecsSection = ({ technicalSpecs, showingTranslateValue }) => {
  if (!technicalSpecs?.length) return null;

  return (
    <div className="mb-6">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <dl className="divide-y divide-gray-100">
          {technicalSpecs.map((spec, i) => (
            <div key={i} className="flex justify-between px-3 py-2.5 text-sm">
              <dt className="text-gray-500 font-medium">
                {typeof spec.key === "object"
                  ? showingTranslateValue(spec.key)
                  : spec.key}
              </dt>
              <dd className="text-gray-700">
                {typeof spec.value === "object"
                  ? showingTranslateValue(spec.value)
                  : spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default TechnicalSpecsSection;
