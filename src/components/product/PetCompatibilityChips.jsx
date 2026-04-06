const PET_LABELS = {
  dog: "Perro",
  cat: "Gato",
  both: "Perro y Gato",
};

const AGE_LABELS = {
  puppy: "Cachorro",
  adult: "Adulto",
  senior: "Senior",
  all: "Todas las edades",
};

const SIZE_LABELS = {
  mini: "Mini",
  small: "Pequeño",
  medium: "Mediano",
  large: "Grande",
  giant: "Gigante",
  all: "Todos los tamaños",
};

const NEEDS_LABELS = {
  sensitive_stomach: "Estómago sensible",
  weight_control: "Control de peso",
  urinary: "Urinario",
  dental: "Dental",
  skin_coat: "Piel y pelo",
  joint: "Articulaciones",
  hypoallergenic: "Hipoalergénico",
};

const PetCompatibilityChips = ({ petCompatibility, showingTranslateValue, recommendedFor }) => {
  if (!petCompatibility) return null;

  const { petType, ageRange, size, breed, specialNeeds } = petCompatibility;
  const hasContent =
    petType?.length || ageRange?.length || size?.length;

  if (!hasContent) return null;

  return (
    <div className="mb-6 border border-gray-200 rounded-lg p-4">
      {/* <h4 className="text-sm font-semibold text-gray-800 mb-3">
        Compatibilidad
      </h4> */}
      <div className="space-y-2">
        {petType?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 w-16">Mascota:</span>
            {petType.map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium"
              >
                {PET_LABELS[p] || p}
              </span>
            ))}
          </div>
        )}
        {ageRange?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 w-16">Edad:</span>
            {ageRange.map((a) => (
              <span
                key={a}
                className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium"
              >
                {AGE_LABELS[a] || a}
              </span>
            ))}
          </div>
        )}
        {size?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 w-16">Tamaño:</span>
            {size.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium"
              >
                {SIZE_LABELS[s] || s}
              </span>
            ))}
          </div>
        )}
        {specialNeeds?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 w-16">Necesidad:</span>
            {specialNeeds.map((n) => (
              <span
                key={n}
                className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-medium"
              >
                {NEEDS_LABELS[n] || n}
              </span>
            ))}
          </div>
        )}
        {breed?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 w-16">Razas:</span>
            <span className="text-xs text-gray-700">{breed.join(", ")}</span>
          </div>
        )}
      </div>
      {recommendedFor && showingTranslateValue(recommendedFor) && (
        <p className="mt-3 text-xs text-gray-600 border-t border-gray-100 pt-2">
          {showingTranslateValue(recommendedFor)}
        </p>
      )}
    </div>
  );
};

export default PetCompatibilityChips;
