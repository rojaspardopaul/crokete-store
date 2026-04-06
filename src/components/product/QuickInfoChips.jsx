const QuickInfoChips = ({ quickInfo }) => {
  if (!quickInfo) return null;

  const chips = [
    { label: quickInfo.pet, icon: "🐾" },
    { label: quickInfo.age, icon: "📅" },
    { label: quickInfo.size, icon: "📏" },
    { label: quickInfo.weightRange, icon: "⚖️" },
  ].filter((c) => c.label);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700"
        >
          <span>{chip.icon}</span>
          {chip.label}
        </span>
      ))}
      {quickInfo.highlight && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-kachabazar-50 text-xs font-medium text-kachabazar-700">
          ✨ {quickInfo.highlight}
        </span>
      )}
    </div>
  );
};

export default QuickInfoChips;
