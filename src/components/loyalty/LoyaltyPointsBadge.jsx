"use client";

import { Star } from "lucide-react";
import { useLoyaltyContext } from "@context/LoyaltyContext";

/**
 * Reusable loyalty points badge.
 * Shows "★ Gana X pts" on products (only for logged-in users).
 *
 * @param {number} price - Product price to calculate points
 * @param {"sm"|"md"} size - sm = compact inline (ProductCard), md = prominent (ProductScreen)
 * @param {string} className - Additional classes
 */
const LoyaltyPointsBadge = ({ price, size = "sm", className = "" }) => {
  const ctx = useLoyaltyContext();
  if (!ctx?.config) return null;

  const { config, openModal, isLoggedIn } = ctx;
  const points = Math.floor((price || 0) * (config.pointsPerDollar || 1));
  if (points <= 0) return null;

  if (size === "sm") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openModal();
        }}
        className={`inline-flex items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer text-kachabazar-600 hover:text-kachabazar-700 ${className}`}
      >
        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
        {isLoggedIn ? (
          <span>+{points} pts por esta compra</span>
        ) : (
          <span>+{points} pts · <span className="underline">¡Regístrate!</span></span>
        )}
      </button>
    );
  }

  // size === "md"
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal();
      }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-sm bg-gradient-to-r from-kachabazar-50 to-amber-50 border-kachabazar-200 text-kachabazar-700 hover:from-kachabazar-100 hover:to-amber-100 hover:border-kachabazar-300 ${className}`}
    >
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      {isLoggedIn ? (
        <span>Gana {points} pts por esta compra</span>
      ) : (
        <span>Gana {points} pts · <span className="underline">¡Regístrate gratis!</span></span>
      )}
    </button>
  );
};

export default LoyaltyPointsBadge;
