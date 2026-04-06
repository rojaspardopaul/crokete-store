"use client";

import { useState, useEffect, useMemo } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const GOALS = [
  { key: "maintenance", label: "Mantenimiento", factor: 1.0, icon: "🟢" },
  { key: "light", label: "Dieta light", factor: 0.85, icon: "🟡" },
  { key: "weight_loss", label: "Pérdida de peso", factor: 0.7, icon: "🟠" },
];

const ACTIVITIES = [
  { key: "normal", label: "Normal", factor: 1.0, desc: "Paseos regulares" },
  { key: "moderate", label: "Moderada", factor: 1.1, desc: "Juego activo diario" },
  { key: "high", label: "Alta", factor: 1.25, desc: "Deporte o trabajo" },
  { key: "extreme", label: "Extrema", factor: 1.4, desc: "Entrenamiento intenso" },
];

const PET_TYPES = [
  { key: "dog", label: "Perro", icon: "🐕" },
  { key: "cat", label: "Gato", icon: "🐈" },
];

// Multiplier for caloric formula based on pet type (MER factor)
const PET_MER_BASE = { dog: 1.6, cat: 1.2 };

const STORAGE_PREFIX = "crokete_ration_";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function interpolateDailyAmount(consumptionGuide, petWeightKg) {
  if (!consumptionGuide?.length) return null;

  const sorted = [...consumptionGuide]
    .filter((r) => r.petWeight > 0 && r.dailyAmount > 0)
    .sort((a, b) => a.petWeight - b.petWeight);

  if (sorted.length === 0) return null;

  if (petWeightKg <= sorted[0].petWeight) return sorted[0].dailyAmount;
  if (petWeightKg >= sorted[sorted.length - 1].petWeight)
    return sorted[sorted.length - 1].dailyAmount;

  for (let i = 0; i < sorted.length - 1; i++) {
    const lo = sorted[i];
    const hi = sorted[i + 1];
    if (petWeightKg >= lo.petWeight && petWeightKg <= hi.petWeight) {
      const t = (petWeightKg - lo.petWeight) / (hi.petWeight - lo.petWeight);
      return Math.round(lo.dailyAmount + t * (hi.dailyAmount - lo.dailyAmount));
    }
  }

  return sorted[sorted.length - 1].dailyAmount;
}

function calcFromCalories(caloriesPerKg, petWeightKg, petType) {
  const rer = 70 * Math.pow(petWeightKg, 0.75);
  const merBase = PET_MER_BASE[petType] || PET_MER_BASE.dog;
  return Math.round((rer * merBase / caloriesPerKg) * 1000);
}

function getDefaultMeals(ageRange) {
  if (!ageRange?.length) return 2;
  if (ageRange.includes("puppy")) return 3;
  return 2;
}

function getDefaultWeight(consumptionGuide) {
  if (!consumptionGuide?.length) return 10;
  const sorted = [...consumptionGuide].sort((a, b) => a.petWeight - b.petWeight);
  return sorted[0].petWeight || 10;
}

function getDefaultAgeUnit(ageRange) {
  return ageRange?.includes("puppy") ? "months" : "years";
}

function getDefaultAge(ageRange) {
  if (ageRange?.includes("puppy")) return 4;
  if (ageRange?.includes("senior")) return 8;
  return 3;
}

function loadSaved(productId) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + productId);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePref(productId, data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_PREFIX + productId, JSON.stringify(data));
  } catch { /* noop */ }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const ChipButton = ({ selected, onClick, children, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
      selected
        ? "bg-kachabazar-600 text-white border-kachabazar-600 shadow-sm"
        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
    } ${className}`}
  >
    {children}
  </button>
);

const NumberInput = ({ label, value, onChange, min = 0, max = 999, unit, step = 1 }) => (
  <div className="flex-1 min-w-0">
    <label className="block text-[11px] font-medium text-gray-500 mb-1">{label}</label>
    <div className="flex items-center gap-1">
      <input
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const v = e.target.value === "" ? "" : Number(e.target.value);
          onChange(v);
        }}
        className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-kachabazar-400 focus:border-kachabazar-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {unit && <span className="text-xs text-gray-400 flex-shrink-0">{unit}</span>}
    </div>
  </div>
);

// ─── Main component ──────────────────────────────────────────────────────────

const RationCalculator = ({
  consumptionGuide,
  effectivePackageInfo,
  nutritionTable,
  petCompatibility,
  productId,
}) => {
  const caloriesPerKg = nutritionTable?.caloriesPerKg || null;
  const ageRange = petCompatibility?.ageRange;
  const petTypes = petCompatibility?.petType || [];
  const showPetSelector =
    petTypes.includes("both") ||
    (petTypes.includes("dog") && petTypes.includes("cat"));

  // Package weight in grams
  const packageGrams = useMemo(() => {
    const info = effectivePackageInfo;
    if (!info?.weight) return null;
    return info.unit === "g" ? info.weight : info.weight * 1000;
  }, [effectivePackageInfo]);

  // ─── State ──
  const [goal, setGoal] = useState(null);
  const [activity, setActivity] = useState(null);
  const [petType, setPetType] = useState(() => {
    if (petTypes.includes("dog") && !petTypes.includes("cat") && !petTypes.includes("both")) return "dog";
    if (petTypes.includes("cat") && !petTypes.includes("dog") && !petTypes.includes("both")) return "cat";
    return "dog";
  });
  const [petWeight, setPetWeight] = useState(() => getDefaultWeight(consumptionGuide));
  const [age, setAge] = useState(() => getDefaultAge(ageRange));
  const [ageUnit, setAgeUnit] = useState(() => getDefaultAgeUnit(ageRange));
  const [meals, setMeals] = useState(() => getDefaultMeals(ageRange));
  // revealed: whether the result panel has been shown (stays true after first calculate)
  const [revealed, setRevealed] = useState(false);

  // ─── Reactive calculation (always fresh — no stale closure) ──
  const calculatedResult = useMemo(() => {
    if (!goal || !activity || !petWeight || petWeight <= 0 || !meals || meals <= 0) return null;

    const goalFactor = GOALS.find((g) => g.key === goal)?.factor ?? 1;
    const activityFactor = ACTIVITIES.find((a) => a.key === activity)?.factor ?? 1;

    let baseDailyG = interpolateDailyAmount(consumptionGuide, petWeight);

    if (caloriesPerKg && caloriesPerKg > 0) {
      const caloricDaily = calcFromCalories(caloriesPerKg, petWeight, petType);
      if (!baseDailyG) baseDailyG = caloricDaily;
      else baseDailyG = Math.round((baseDailyG + caloricDaily) / 2);
    }

    if (!baseDailyG || baseDailyG <= 0) return null;

    const adjustedDaily = Math.round(baseDailyG * goalFactor * activityFactor);
    const perRation = Math.round(adjustedDaily / meals);
    const bagDays =
      packageGrams && adjustedDaily > 0
        ? Math.round(packageGrams / adjustedDaily)
        : null;

    return { adjustedDaily, perRation, bagDays, meals };
  }, [goal, activity, petWeight, meals, petType, consumptionGuide, caloriesPerKg, packageGrams]);

  // Restore saved preferences
  useEffect(() => {
    if (!productId) return;
    const saved = loadSaved(productId);
    if (!saved) return;
    if (saved.goal) setGoal(saved.goal);
    if (saved.activity) setActivity(saved.activity);
    if (saved.petType) setPetType(saved.petType);
    if (saved.petWeight) setPetWeight(saved.petWeight);
    if (saved.age) setAge(saved.age);
    if (saved.ageUnit) setAgeUnit(saved.ageUnit);
    if (saved.meals) setMeals(saved.meals);
    if (saved.revealed) setRevealed(true);
  }, [productId]);

  // Hide result when package/variant changes
  useEffect(() => {
    setRevealed(false);
  }, [packageGrams]);

  const handleCalculate = () => {
    if (!calculatedResult) return;
    setRevealed(true);
    if (productId) {
      savePref(productId, { goal, activity, petType, petWeight, age, ageUnit, meals, revealed: true });
    }
  };

  const showStep2 = !!goal;
  const showStep3 = !!goal && !!activity;
  const showResult = revealed && !!calculatedResult;

  return (
    <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-kachabazar-50 to-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-kachabazar-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-sm font-semibold text-gray-800">Calculadora de raciones</h3>
        </div>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Calcula la ración diaria ideal para tu mascota
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Pet type selector (only if product is for both) */}
        {showPetSelector && (
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Tipo de mascota</p>
            <div className="flex gap-2">
              {PET_TYPES.map((pt) => (
                <ChipButton
                  key={pt.key}
                  selected={petType === pt.key}
                  onClick={() => setPetType(pt.key)}
                >
                  {pt.icon} {pt.label}
                </ChipButton>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Goal */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-kachabazar-100 text-kachabazar-700 text-[10px] font-bold mr-1">
              1
            </span>
            Objetivo alimenticio
          </p>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <ChipButton
                key={g.key}
                selected={goal === g.key}
                onClick={() => setGoal(g.key)}
              >
                {g.icon} {g.label}
              </ChipButton>
            ))}
          </div>
        </div>

        {/* Step 2: Activity */}
        {showStep2 && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-xs font-medium text-gray-600 mb-2">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-kachabazar-100 text-kachabazar-700 text-[10px] font-bold mr-1">
                2
              </span>
              Nivel de actividad
            </p>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES.map((a) => (
                <ChipButton
                  key={a.key}
                  selected={activity === a.key}
                  onClick={() => setActivity(a.key)}
                >
                  {a.label}
                </ChipButton>
              ))}
            </div>
            {activity && (
              <p className="text-[11px] text-gray-400 mt-1">
                {ACTIVITIES.find((a) => a.key === activity)?.desc}
              </p>
            )}
          </div>
        )}

        {/* Step 3: Pet data */}
        {showStep3 && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-xs font-medium text-gray-600 mb-2">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-kachabazar-100 text-kachabazar-700 text-[10px] font-bold mr-1">
                3
              </span>
              Datos de tu mascota
            </p>
            <div className="flex flex-wrap gap-3">
              {/* Age */}
              <div className="flex-1 min-w-[100px]">
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Edad
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={1}
                    max={ageUnit === "months" ? 24 : 30}
                    value={age}
                    onChange={(e) =>
                      setAge(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-kachabazar-400 focus:border-kachabazar-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setAgeUnit((u) => (u === "months" ? "years" : "months"))
                    }
                    className="flex-shrink-0 h-9 px-2 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    {ageUnit === "months" ? "meses" : "años"}
                  </button>
                </div>
              </div>

              {/* Weight */}
              <NumberInput
                label="Peso"
                value={petWeight}
                onChange={setPetWeight}
                min={0.5}
                max={150}
                unit="kg"
                step={0.5}
              />

              {/* Meals */}
              <NumberInput
                label="Comidas/día"
                value={meals}
                onChange={setMeals}
                min={1}
                max={6}
              />
            </div>
          </div>
        )}

        {/* Calculate button */}
        {showStep3 && (
          <button
            type="button"
            onClick={handleCalculate}
            disabled={!calculatedResult}
            className="w-full h-10 rounded-lg bg-kachabazar-600 text-white text-sm font-semibold hover:bg-kachabazar-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {revealed ? "Recalcular racionamiento" : "Calcular racionamiento"}
          </button>
        )}

        {/* Result — auto-updates when inputs change after first calculation */}
        {showResult && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 rounded-lg bg-kachabazar-50 border border-kachabazar-100 p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-[11px] text-gray-500 mb-0.5">Cantidad diaria</p>
                <p className="text-2xl font-bold text-kachabazar-700">
                  {calculatedResult.adjustedDaily}
                  <span className="text-sm font-medium text-kachabazar-500"> g</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-[11px] text-gray-500 mb-0.5">
                  Por ración ({calculatedResult.meals}{" "}
                  {calculatedResult.meals === 1 ? "comida" : "comidas"})
                </p>
                <p className="text-2xl font-bold text-kachabazar-700">
                  {calculatedResult.perRation}
                  <span className="text-sm font-medium text-kachabazar-500"> g</span>
                </p>
              </div>
            </div>

            {calculatedResult.bagDays && (
              <div className="mt-3 pt-3 border-t border-kachabazar-100 text-center">
                <p className="text-xs text-gray-500">
                  Esta bolsa dura aproximadamente
                  <span className="font-bold text-kachabazar-700 mx-1">
                    ~{calculatedResult.bagDays} días
                  </span>
                </p>
              </div>
            )}

            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Valores orientativos. Consulta a tu veterinario para una dieta personalizada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RationCalculator;
