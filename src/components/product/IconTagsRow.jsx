const ICON_MAP = {
  hypoallergenic: "🛡️",
  grain_free: "🌾",
  high_protein: "💪",
  low_fat: "🥗",
  natural: "🌿",
  organic: "🍃",
  sensitive_stomach: "🫧",
  joint_support: "🦴",
  skin_coat: "✨",
  dental_care: "🦷",
  weight_control: "⚖️",
  puppy_formula: "🐶",
  vet_recommended: "🏥",
  prebiotics: "🦠",
  omega_3_6: "🐟",
  no_artificial: "🚫",
  gluten_free: "🌾",
  sugar_free: "🍬",
  pregnant_dog: "🐕",
  newborn_puppy: "🍼",
};

const ICON_LABELS = {
  hypoallergenic: "Hipoalergénico",
  grain_free: "Sin granos",
  high_protein: "Alto en proteína",
  low_fat: "Bajo en grasa",
  natural: "Natural",
  organic: "Orgánico",
  sensitive_stomach: "Estómago sensible",
  joint_support: "Soporte articular",
  skin_coat: "Piel y pelo",
  dental_care: "Cuidado dental",
  weight_control: "Control de peso",
  puppy_formula: "Fórmula cachorro",
  vet_recommended: "Recomendado veterinario",
  prebiotics: "Prebióticos",
  omega_3_6: "Omega 3 y 6",
  no_artificial: "Sin artificiales",
  gluten_free: "Sin gluten",
  sugar_free: "Sin azúcar",
  pregnant_dog: "Perra gestante",
  newborn_puppy: "Cachorro recién nacido",
};

const IconTagsRow = ({ iconTags }) => {
  if (!iconTags?.length) return null;

  return (
    <div className="flex flex-wrap gap-3 mb-3">
      {iconTags.map((tag) => (
        <div
          key={tag}
          className="flex flex-col items-center gap-0.5"
          title={ICON_LABELS[tag] || tag}
        >
          <span className="text-lg">{ICON_MAP[tag] || "•"}</span>
          <span className="text-[10px] text-gray-500 text-center leading-tight max-w-[60px]">
            {ICON_LABELS[tag] || tag}
          </span>
        </div>
      ))}
    </div>
  );
};

export default IconTagsRow;
