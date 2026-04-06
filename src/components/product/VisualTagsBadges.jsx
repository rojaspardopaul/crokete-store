const TAG_CONFIG = {
  new: { label: "Nuevo", bg: "bg-blue-100", text: "text-blue-800" },
  bestseller: { label: "Más vendido", bg: "bg-amber-100", text: "text-amber-800" },
  organic: { label: "Orgánico", bg: "bg-green-100", text: "text-green-800" },
  grain_free: { label: "Sin granos", bg: "bg-lime-100", text: "text-lime-800" },
  prescription: { label: "Con receta", bg: "bg-red-100", text: "text-red-800" },
  eco: { label: "Eco-friendly", bg: "bg-emerald-100", text: "text-emerald-800" },
  limited_edition: { label: "Edición limitada", bg: "bg-purple-100", text: "text-purple-800" },
  vet_recommended: { label: "Recomendado por veterinarios", bg: "bg-teal-100", text: "text-teal-800" },
  sale: { label: "En oferta", bg: "bg-rose-100", text: "text-rose-800" },
};

const VisualTagsBadges = ({ visualTags }) => {
  if (!visualTags?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mb-2">
      {visualTags.map((tag) => {
        const config = TAG_CONFIG[tag];
        if (!config) return null;
        return (
          <span
            key={tag}
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
          >
            {config.label}
          </span>
        );
      })}
    </div>
  );
};

export default VisualTagsBadges;
