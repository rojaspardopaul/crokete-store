const KeyFactsPills = ({ keyFacts }) => {
  if (!keyFacts?.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {keyFacts.slice(0, 5).map((fact, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs"
        >
          <span className="font-semibold text-gray-800">{fact.label}</span>
          <span className="text-gray-500">{fact.value}</span>
        </div>
      ))}
    </div>
  );
};

export default KeyFactsPills;
