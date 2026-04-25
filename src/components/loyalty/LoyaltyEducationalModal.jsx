"use client";

import { Fragment } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Star, ShoppingBag, TrendingUp, Gift, X, ChevronRight, Trophy, Check } from "lucide-react";
import Link from "next/link";
import { useLoyaltyContext } from "@context/LoyaltyContext";

const TIER_CONFIG = {
  nuevo: { emoji: "🐾", label: "Nuevo", color: "text-gray-600", bg: "bg-gray-100", ring: "ring-gray-300" },
  frecuente: { emoji: "⭐", label: "Frecuente", color: "text-blue-700", bg: "bg-blue-50", ring: "ring-blue-300" },
  vip: { emoji: "👑", label: "VIP", color: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-300" },
};

const steps = [
  {
    icon: ShoppingBag,
    title: "Compra",
    color: "from-kachabazar-500 to-kachabazar-600",
    bgLight: "bg-kachabazar-50",
    textColor: "text-kachabazar-700",
  },
  {
    icon: TrendingUp,
    title: "Sube de nivel",
    color: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    icon: Gift,
    title: "Canjea",
    color: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-50",
    textColor: "text-amber-700",
  },
];

const LoyaltyEducationalModal = () => {
  const ctx = useLoyaltyContext();
  if (!ctx) return null;

  const { config, loyalty, isLoggedIn, showEducationalModal, closeModal } = ctx;
  if (!config) return null;

  const currentTier = loyalty?.tier || "nuevo";
  const orderCount = loyalty?.orderCount || 0;

  // Sort milestones by orderCount
  const sortedMilestones = [...(config.milestones || [])].sort(
    (a, b) => a.orderCount - b.orderCount
  );

  // Find next milestone
  const nextMilestone = sortedMilestones.find((m) => m.orderCount > orderCount);

  return (
    <Transition appear show={showEducationalModal} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={closeModal}>
        {/* Overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-6 py-5">
                  <button
                    onClick={closeModal}
                    className="absolute right-4 top-4 rounded-full bg-white/20 p-1.5 text-white hover:bg-white/30 transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Puntos de Recompensa
                      </h2>
                      <p className="text-sm text-amber-100">
                        Programa de lealtad para clientes frecuentes
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 Steps */}
                <div className="px-6 pt-6 pb-2">
                  <div className="grid grid-cols-3 gap-3">
                    {steps.map((step, idx) => (
                      <div key={step.title} className="relative text-center">
                        {/* Connector line */}
                        {idx < steps.length - 1 && (
                          <div className="absolute top-5 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200 z-0" />
                        )}
                        <div
                          className={`relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${step.color} shadow-md animate-paw-pop`}
                          style={{ animationDelay: `${idx * 150}ms` }}
                        >
                          <step.icon className="h-5 w-5 text-white" />
                        </div>
                        <p className={`mt-2 text-xs font-semibold ${step.textColor}`}>
                          {step.title}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Step descriptions */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-start gap-3 rounded-lg bg-kachabazar-50 p-3">
                      <ShoppingBag className="mt-0.5 h-4 w-4 text-kachabazar-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Cada compra te da puntos
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Ganas <span className="font-semibold text-kachabazar-700">{config.pointsPerDollar} punto{config.pointsPerDollar > 1 ? "s" : ""}</span> por cada $1 gastado
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3">
                      <TrendingUp className="mt-0.5 h-4 w-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Alcanza nuevos niveles
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {Object.entries(TIER_CONFIG).map(([key, tier]) => (
                            <span
                              key={key}
                              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${tier.bg} ${tier.color} ring-1 ${tier.ring} ${
                                isLoggedIn && currentTier === key ? "ring-2 shadow-sm" : ""
                              }`}
                            >
                              <span>{tier.emoji}</span> {tier.label}
                              {key !== "nuevo" && (
                                <span className="text-[10px] opacity-70">
                                  ({config.tierThresholds?.[key]}+ compras)
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3">
                      <Gift className="mt-0.5 h-4 w-4 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Canjea por descuentos exclusivos
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Acumula <span className="font-semibold text-amber-700">{config.minRedeemPoints} puntos</span> y canjéalos por descuentos en tus compras
                        </p>
                        <p className="text-xs text-amber-700 font-semibold mt-1">
                          1 punto = ${config.pointValue} MXN — {config.minRedeemPoints} pts = ${(config.minRedeemPoints * config.pointValue).toFixed(2)} MXN de descuento
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                {sortedMilestones.length > 0 && (
                  <div className="px-6 pt-4 pb-2">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2.5 flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500" />
                      Hitos de compra
                    </h3>
                    <div className="space-y-2">
                      {sortedMilestones.map((m) => {
                        const achieved = isLoggedIn && orderCount >= m.orderCount;
                        return (
                          <div
                            key={m.orderCount}
                            className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition ${
                              achieved
                                ? "border-green-200 bg-green-50"
                                : "border-gray-100 bg-gray-50"
                            }`}
                          >
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                achieved
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {achieved ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <span className="text-[10px] font-bold">{m.orderCount}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-medium ${achieved ? "text-green-700" : "text-gray-700"}`}>
                                {m.label || `Compra #${m.orderCount}`}
                              </p>
                            </div>
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                achieved
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {m.discountPercent}% dto
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Progress bar (logged in) */}
                {isLoggedIn && nextMilestone && (
                  <div className="px-6 pt-3 pb-2">
                    <div className="rounded-lg bg-gradient-to-r from-kachabazar-50 to-blue-50 p-3 border border-kachabazar-100">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-600">Tu progreso</span>
                        <span className="font-semibold text-kachabazar-700">
                          {orderCount}/{nextMilestone.orderCount} compras
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-kachabazar-500 to-blue-500 transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              (orderCount / nextMilestone.orderCount) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1.5">
                        ¡Te {nextMilestone.orderCount - orderCount === 1 ? "falta" : "faltan"}{" "}
                        <span className="font-semibold text-kachabazar-700">
                          {nextMilestone.orderCount - orderCount} compra{nextMilestone.orderCount - orderCount > 1 ? "s" : ""}
                        </span>{" "}
                        para obtener {nextMilestone.discountPercent}% de descuento!
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="px-6 pt-3 pb-6">
                  {isLoggedIn ? (
                    <Link
                      href="/user/rewards"
                      onClick={closeModal}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-3 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-yellow-600 transition-all"
                    >
                      <Gift className="h-4 w-4" />
                      Ver mis recompensas
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/signup"
                        onClick={closeModal}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-3 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-yellow-600 transition-all"
                      >
                        Crear cuenta gratis
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/auth/login"
                        onClick={closeModal}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        Ya tengo cuenta — Iniciar sesión
                      </Link>
                    </div>
                  )}

                  <p className="text-[10px] text-gray-400 text-center mt-3">
                    Los puntos se acumulan al recibir tu pedido. Los descuentos se aplican como cupones en el checkout.
                  </p>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoyaltyEducationalModal;
