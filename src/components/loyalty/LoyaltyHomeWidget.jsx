"use client";

import { Star, Gift, ChevronRight, Trophy, TrendingUp, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";
import { useLoyaltyContext } from "@context/LoyaltyContext";

const TIER_CONFIG = {
  nuevo: { emoji: "🐾", label: "Nuevo", gradient: "from-gray-400 to-gray-500" },
  frecuente: { emoji: "⭐", label: "Frecuente", gradient: "from-blue-500 to-blue-600" },
  vip: { emoji: "👑", label: "VIP", gradient: "from-amber-500 to-yellow-500" },
};

/**
 * Widget that replaces OfferCard on the homepage.
 * Shows personalized loyalty info for logged-in users,
 * or a CTA to join the program for guests.
 */
const LoyaltyHomeWidget = ({ rewards }) => {
  const ctx = useLoyaltyContext();

  if (!ctx?.config) return null;

  return ctx.isLoggedIn ? (
    <LoggedInWidget ctx={ctx} rewards={rewards} />
  ) : (
    <GuestWidget ctx={ctx} />
  );
};

// ============================================
// LOGGED IN: Personalized rewards summary
// ============================================
const LoggedInWidget = ({ ctx, rewards }) => {
  const { loyalty, config, openModal } = ctx;
  const tier = TIER_CONFIG[loyalty?.tier] || TIER_CONFIG.nuevo;
  const orderCount = loyalty?.orderCount || 0;

  const sortedMilestones = [...(config.milestones || [])].sort(
    (a, b) => a.orderCount - b.orderCount
  );
  const nextMilestone = sortedMilestones.find((m) => m.orderCount > orderCount);

  // Get first unused reward
  const activeReward = rewards?.[0];

  return (
    <div className="w-full h-full flex flex-col rounded-2xl border border-kachabazar-200 bg-gradient-to-br from-kachabazar-50 via-white to-crokete-cream-50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-kachabazar-500 to-kachabazar-600 px-3 py-1.5 lg:px-4 lg:py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-white" />
          <h3 className="text-xs lg:text-sm font-bold text-white">Crokete Rewards</h3>
        </div>
        <button
          onClick={openModal}
          className="text-[10px] lg:text-[11px] text-kachabazar-100 hover:text-white font-medium transition cursor-pointer"
        >
          ¿Cómo funciona?
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-between px-3 py-2 lg:px-5 lg:py-4 gap-2 lg:gap-3">
        {/* ===== Desktop: Tier+Points LEFT | Next milestone RIGHT ===== */}
        <div className="hidden lg:flex lg:flex-row gap-4 flex-1 min-h-0 items-center">
          {/* Tier + Points */}
          <div className="flex flex-col justify-center gap-3 flex-1">
            <div className="flex items-center gap-3">
              <span
                className={`flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br ${tier.gradient} text-white text-lg shadow-md`}
              >
                {tier.emoji}
              </span>
              <div>
                <p className="text-[11px] text-gray-500">Tu nivel</p>
                <p className="text-sm font-bold text-crokete-earth-800">{tier.label}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[11px] text-gray-500">Puntos</p>
                <p className="text-lg font-bold text-kachabazar-700 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-kachabazar-400 text-kachabazar-400" />
                  {loyalty?.points ?? 0}
                </p>
              </div>
            </div>
            {/* Active reward coupon inline */}
            {activeReward && <RewardCoupon reward={activeReward} />}
          </div>

          {/* Next milestone — right column */}
          {nextMilestone && (
            <div className="flex flex-col justify-center rounded-xl bg-kachabazar-50 border border-kachabazar-100 p-3 flex-shrink-0 min-w-[160px]">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-gray-500 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Próximo hito
                </span>
                <span className="font-semibold text-kachabazar-700">
                  {orderCount}/{nextMilestone.orderCount}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-kachabazar-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-kachabazar-500 to-kachabazar-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (orderCount / nextMilestone.orderCount) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5">
                ¡{nextMilestone.orderCount - orderCount === 1 ? "Falta" : "Faltan"}{" "}
                <span className="font-semibold text-kachabazar-700">
                  {nextMilestone.orderCount - orderCount}
                </span>{" "}
                compra{nextMilestone.orderCount - orderCount > 1 ? "s" : ""} para{" "}
                <span className="font-semibold text-kachabazar-600">
                  {nextMilestone.discountPercent}% dto
                </span>
              </p>
            </div>
          )}
        </div>

        {/* ===== Mobile: Stacked layout ===== */}
        <div className="lg:hidden space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br ${tier.gradient} text-white text-sm shadow-md`}
              >
                {tier.emoji}
              </span>
              <div>
                <p className="text-[10px] text-gray-500">Tu nivel</p>
                <p className="text-xs font-bold text-crokete-earth-800">{tier.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500">Puntos</p>
              <p className="text-base font-bold text-kachabazar-700 flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-kachabazar-400 text-kachabazar-400" />
                {loyalty?.points ?? 0}
              </p>
            </div>
          </div>

          {nextMilestone && (
            <div className="rounded-lg bg-kachabazar-50 border border-kachabazar-100 p-2">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-gray-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Próximo hito
                </span>
                <span className="font-semibold text-kachabazar-700">
                  {orderCount}/{nextMilestone.orderCount}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-kachabazar-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-kachabazar-500 to-kachabazar-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (orderCount / nextMilestone.orderCount) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                ¡{nextMilestone.orderCount - orderCount === 1 ? "Falta" : "Faltan"}{" "}
                <span className="font-semibold text-kachabazar-700">
                  {nextMilestone.orderCount - orderCount}
                </span>{" "}
                compra{nextMilestone.orderCount - orderCount > 1 ? "s" : ""} para{" "}
                <span className="font-semibold text-kachabazar-600">
                  {nextMilestone.discountPercent}% dto
                </span>
              </p>
            </div>
          )}

          {activeReward && <RewardCoupon reward={activeReward} />}
        </div>

        {/* CTA — desktop: side by side · mobile: full width */}
        <div className="mt-auto flex flex-col lg:flex-row gap-1.5 lg:gap-2">
          <Link
            href="/user/rewards"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-kachabazar-500 px-3 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold text-white shadow-sm hover:bg-kachabazar-600 transition-all lg:flex-1"
          >
            <Gift className="h-3.5 w-3.5" />
            Ver mis recompensas
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Mini coupon card with copy
const RewardCoupon = ({ reward }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(reward.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [reward.couponCode]);

  return (
    <div className="rounded-lg border border-dashed border-kachabazar-300 bg-kachabazar-50 p-2 lg:p-3">
      <p className="text-[10px] lg:text-[11px] text-kachabazar-700 font-medium mb-1 lg:mb-1.5">
        🎁 Cupón disponible - {reward.discountValue}% descuento
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-center text-[10px] lg:text-xs font-bold tracking-wider text-kachabazar-800 bg-white rounded px-2 py-0.5 lg:py-1 border border-kachabazar-200">
          {reward.couponCode}
        </code>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium text-kachabazar-600 hover:text-kachabazar-800 transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copiado
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copiar
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================
// GUEST: CTA to join the program
// ============================================
const GuestWidget = ({ ctx }) => {
  const { config, openModal } = ctx;
  const sortedMilestones = [...(config.milestones || [])].sort(
    (a, b) => a.orderCount - b.orderCount
  );

  const benefits = [
    { icon: Star, text: "Gana puntos por cada compra", shortText: "Gana puntos", color: "text-amber-600", bg: "bg-amber-100" },
    { icon: TrendingUp, text: "Nuevo → Frecuente → VIP", shortText: "Sube de nivel", color: "text-blue-600", bg: "bg-blue-100" },
    { icon: Gift, text: "Descuentos y cupones exclusivos", shortText: "Descuentos", color: "text-green-600", bg: "bg-green-100" },
  ];

  return (
    <div className="w-full h-full flex flex-col rounded-2xl border border-kachabazar-200 bg-gradient-to-br from-kachabazar-50 via-white to-crokete-cream-50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-kachabazar-500 to-kachabazar-600 px-3 py-1.5 lg:px-4 lg:py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-white" />
          <h3 className="text-xs lg:text-sm font-bold text-white">Únete a Crokete Rewards</h3>
        </div>
        <button
          onClick={openModal}
          className="text-[10px] lg:text-[11px] text-kachabazar-100 hover:text-white font-medium transition cursor-pointer whitespace-nowrap lg:hidden"
        >
          ¿Cómo funciona?
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-between px-3 py-2 lg:px-5 lg:py-4 gap-2 lg:gap-3">
        {/* ===== MOBILE: horizontal benefits row ===== */}
        <div className="flex flex-row gap-3 lg:hidden">
          {benefits.map((b) => (
            <div key={b.shortText} className="flex flex-col items-center gap-1 flex-1">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full ${b.bg} flex-shrink-0`}>
                <b.icon className={`h-3 w-3 ${b.color}`} />
              </div>
              <p className="text-[10px] font-medium text-gray-700 text-center leading-tight">{b.shortText}</p>
            </div>
          ))}
        </div>

        {/* ===== DESKTOP/TABLET: Benefits LEFT + Milestones RIGHT ===== */}
        <div className="hidden lg:flex lg:flex-row gap-4 flex-1 min-h-0 items-center">
          {/* Benefits column */}
          <div className="flex flex-col gap-2.5 flex-1">
            {benefits.map((b) => (
              <div key={b.text} className="flex items-center gap-2.5">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${b.bg} flex-shrink-0`}>
                  <b.icon className={`h-3.5 w-3.5 ${b.color}`} />
                </div>
                <p className="text-xs font-medium text-gray-700 leading-tight">{b.text}</p>
              </div>
            ))}
          </div>

          {/* Milestones column */}
          {sortedMilestones.length > 0 && (
            <div className="flex flex-col justify-center rounded-xl bg-white/80 border border-gray-100 px-3 py-2.5 flex-shrink-0">
              <p className="text-[11px] font-semibold text-gray-500 mb-1.5">Hitos de compra</p>
              <div className="flex flex-col gap-1.5">
                {sortedMilestones.map((m) => (
                  <span
                    key={m.orderCount}
                    className="inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-kachabazar-50 text-kachabazar-700 whitespace-nowrap"
                  >
                    #{m.orderCount} → {m.discountPercent}% dto
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile milestones — hidden on xs, visible on sm (tablets in portrait) */}
        {sortedMilestones.length > 0 && (
          <div className="hidden sm:flex lg:hidden flex-wrap gap-1.5">
            {sortedMilestones.map((m) => (
              <span
                key={m.orderCount}
                className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-kachabazar-50 text-kachabazar-700"
              >
                #{m.orderCount} → {m.discountPercent}% dto
              </span>
            ))}
          </div>
        )}

        {/* Mobile: notice */}
        <p className="text-[10px] text-center text-kachabazar-600 font-medium lg:hidden">
          🐾 Solo registrados acumulan puntos
        </p>

        {/* CTA — mobile: stacked · desktop: side by side 50/50 */}
        <div className="mt-auto flex flex-col lg:flex-row gap-1.5 lg:gap-2">
          <Link
            href="/auth/signup"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-kachabazar-500 px-3 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold text-white shadow-sm hover:bg-kachabazar-600 transition-all lg:flex-1"
          >
            Crear cuenta gratis
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={openModal}
            className="hidden lg:flex items-center justify-center gap-1 rounded-xl border border-kachabazar-200 bg-white text-xs lg:text-sm text-kachabazar-600 hover:bg-kachabazar-50 hover:text-kachabazar-800 font-medium transition cursor-pointer px-3 py-2 lg:py-2.5 lg:flex-1"
          >
            ¿Cómo funciona?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyHomeWidget;
