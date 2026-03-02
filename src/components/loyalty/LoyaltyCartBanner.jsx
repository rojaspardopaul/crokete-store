"use client";

import { Star, Gift } from "lucide-react";
import Link from "next/link";
import { useLoyaltyContext } from "@context/LoyaltyContext";

/**
 * Shows estimated points and available rewards in the cart drawer and checkout.
 * Only visible to logged-in users with loyalty enabled.
 */
const LoyaltyCartBanner = ({ cartTotal, compact = false }) => {
  const ctx = useLoyaltyContext();
  if (!ctx?.config || !ctx.isLoggedIn) return null;

  const { config, loyalty } = ctx;
  const estimatedPoints = Math.floor((cartTotal || 0) * (config.pointsPerDollar || 1));
  const availableRewards = loyalty?.availableRewards || 0;

  if (estimatedPoints <= 0) return null;

  if (compact) {
    return (
      <div className="flex items-center justify-between text-xs bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
        <span className="flex items-center gap-1 text-amber-700 font-medium">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          Ganarás ~{estimatedPoints} pts con esta compra
        </span>
        {availableRewards > 0 && (
          <span className="flex items-center gap-1 text-green-700 font-medium">
            <Gift className="h-3 w-3" />
            {availableRewards} cupón{availableRewards > 1 ? "es" : ""}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 px-3 py-2.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          Ganarás ~{estimatedPoints} puntos con esta compra
        </span>
      </div>
      {availableRewards > 0 && (
        <Link
          href="/user/rewards"
          className="flex items-center gap-1 mt-1.5 text-[11px] text-green-700 hover:text-green-900 font-medium transition"
        >
          <Gift className="h-3 w-3" />
          Tienes {availableRewards} cupón{availableRewards > 1 ? "es" : ""} de recompensa disponible{availableRewards > 1 ? "s" : ""}
        </Link>
      )}
    </div>
  );
};

export default LoyaltyCartBanner;
