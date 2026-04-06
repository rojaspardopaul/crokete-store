"use client";

import { Star, HelpCircle } from "lucide-react";
import { useLoyaltyContext } from "@context/LoyaltyContext";

const TIER_CONFIG = {
  nuevo: { emoji: "🐾", label: "Nuevo", bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
  frecuente: { emoji: "⭐", label: "Frecuente", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  vip: { emoji: "👑", label: "VIP", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

/**
 * Shows current user's tier + points on the product detail page.
 * Only visible to logged-in users with loyalty data.
 */
const LoyaltyProductInfo = ({ className = "" }) => {
  const ctx = useLoyaltyContext();
  if (!ctx?.config) return null;

  const { loyalty, openModal, isLoggedIn } = ctx;

  // Guest variant — encourage registration
  if (!isLoggedIn) {
    return (
      <div
        className={`flex items-center justify-between rounded-lg border border-kachabazar-200 bg-kachabazar-50 px-3 py-2 ${className}`}
      >
        <div className="flex items-center gap-2 text-xs">
          <span>🐾</span>
          <span className="font-medium text-kachabazar-700">
            ¡Regístrate y gana puntos en cada compra!
          </span>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="flex items-center gap-1 text-[11px] text-kachabazar-600 hover:text-kachabazar-800 font-medium transition-colors cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Más info
        </button>
      </div>
    );
  }

  // Logged in but loyalty data not loaded yet
  if (!loyalty) return null;

  const tier = TIER_CONFIG[loyalty.tier] || TIER_CONFIG.nuevo;

  return (
    <div
      className={`flex items-center justify-between rounded-lg border ${tier.border} ${tier.bg} px-3 py-2 ${className}`}
    >
      <div className="flex items-center gap-2 text-xs">
        <span>{tier.emoji}</span>
        <span className={`font-medium ${tier.text}`}>
          Tu nivel: {tier.label}
        </span>
        <span className="text-gray-400">·</span>
        <span className="font-semibold text-kachabazar-700 flex items-center gap-0.5">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {loyalty.points ?? 0} pts
        </span>
      </div>
      <button
        type="button"
        onClick={openModal}
        className="flex items-center gap-1 text-[11px] text-kachabazar-600 hover:text-kachabazar-800 font-medium transition-colors cursor-pointer"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        ¿Cómo funciona?
      </button>
    </div>
  );
};

export default LoyaltyProductInfo;
