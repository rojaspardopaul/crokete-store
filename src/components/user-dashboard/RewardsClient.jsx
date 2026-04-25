"use client";

import { useState } from "react";
import {
  Gift,
  Star,
  Trophy,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import useLoyalty from "@hooks/useLoyalty";

const tierConfig = {
  nuevo: {
    label: "Nuevo",
    color: "text-gray-600",
    bg: "bg-gray-100",
    border: "border-gray-200",
    icon: "🐾",
  },
  frecuente: {
    label: "Frecuente",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "⭐",
  },
  vip: {
    label: "VIP",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "👑",
  },
};

const transactionIcons = {
  earned: <TrendingUp className="w-4 h-4 text-green-500" />,
  redeemed: <Gift className="w-4 h-4 text-blue-500" />,
  expired: <Clock className="w-4 h-4 text-gray-400" />,
  adjusted: <Star className="w-4 h-4 text-amber-500" />,
  milestone_bonus: <Trophy className="w-4 h-4 text-purple-500" />,
};

export default function RewardsClient({
  loyaltyData,
  historyData,
  rewardsData,
  token,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [redeemAmount, setRedeemAmount] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);
  const [redeemResult, setRedeemResult] = useState(null);

  const { loading, error, redeemPoints, initToken } = useLoyalty();

  // Initialize token for client-side requests
  if (token) initToken(token);

  const loyalty = loyaltyData?.loyalty || {};
  const config = loyaltyData?.config || {};
  const transactions = historyData?.transactions || [];
  const availableRewards = rewardsData?.available || [];
  const rewardHistory = rewardsData?.history || [];
  const tier = tierConfig[loyalty.tier] || tierConfig.nuevo;

  const pointsValue = loyaltyData?.pointsValue || 0;
  const nextMilestone = loyaltyData?.nextMilestone;
  const nextTier = loyaltyData?.nextTier;

  const handleRedeem = async () => {
    const pts = parseInt(redeemAmount);
    if (!pts || pts < (config.minRedeemPoints || 100)) return;
    if (pts > loyalty.points) return;

    const result = await redeemPoints(pts);
    if (result.success) {
      setRedeemResult(result.data);
      setRedeemAmount("");
      // Refresh would be needed here in production
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const tabs = [
    { id: "overview", label: "Resumen", icon: Star },
    { id: "rewards", label: "Recompensas", icon: Gift },
    { id: "history", label: "Historial", icon: Clock },
    { id: "redeem", label: "Canjear", icon: Sparkles },
  ];

  if (!loyaltyData?.enabled) {
    return (
      <div className="text-center py-16">
        <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">
          Programa de recompensas próximamente
        </h3>
        <p className="text-gray-400 mt-2">
          Estamos preparando algo especial para ti.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Mis Recompensas
        </h2>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${tier.bg} ${tier.color} border ${tier.border}`}
        >
          {tier.icon} {tier.label}
        </span>
      </div>

      {/* Points Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Current Points */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <p className="text-sm opacity-80 mb-1">Puntos disponibles</p>
          <p className="text-3xl font-bold">{loyalty.points || 0}</p>
          <p className="text-sm opacity-70 mt-1">
            Equivale a ${pointsValue} MXN
          </p>
        </div>

        {/* Total Earned */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Puntos totales ganados</p>
          <p className="text-3xl font-bold text-gray-800">
            {loyalty.totalPoints || 0}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            ≈ ${((loyalty.totalPoints || 0) * (config.pointValue || 0.1)).toFixed(2)} MXN · {loyalty.orderCount || 0} pedidos
          </p>
        </div>

        {/* Next Milestone */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Próximo hito</p>
          {nextMilestone ? (
            <>
              <p className="text-lg font-bold text-amber-600">
                {nextMilestone.label}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Te faltan{" "}
                {nextMilestone.orderCount - (loyalty.orderCount || 0)} pedidos
              </p>
            </>
          ) : (
            <p className="text-lg font-bold text-green-600">
              ¡Todos completados! 🎉
            </p>
          )}
        </div>
      </div>

      {/* Tier Progress */}
      {nextTier && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Progreso al nivel{" "}
              <span className="font-bold capitalize">{nextTier.name}</span>
            </span>
            <span className="text-sm text-gray-400">
              {nextTier.ordersNeeded} pedidos restantes
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-500 bg-blue-500"
              style={{
                width: `${Math.min(
                  100,
                  ((loyalty.orderCount || 0) /
                    ((loyalty.orderCount || 0) + nextTier.ordersNeeded)) *
                    100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 justify-center cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* How it works */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              ¿Cómo funciona?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="font-medium text-gray-800 text-sm">
                  Gana puntos
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {config.pointsPerDollar || 1} punto por cada $1 MXN de compra
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-amber-500" />
                </div>
                <h4 className="font-medium text-gray-800 text-sm">
                  Sube de nivel
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Desbloquea hitos y obtén descuentos exclusivos
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-green-500" />
                </div>
                <h4 className="font-medium text-gray-800 text-sm">
                  Canjea recompensas
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Cada punto vale ${config.pointValue || 0.1} MXN en descuentos
                </p>
              </div>
            </div>
          </div>

          {/* Milestones */}
          {config.milestones && config.milestones.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Hitos de compra
              </h3>
              <div className="space-y-3">
                {config.milestones
                  .sort((a, b) => a.orderCount - b.orderCount)
                  .map((m, i) => {
                    const achieved =
                      (loyalty.orderCount || 0) >= m.orderCount;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          achieved
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        {achieved ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              achieved ? "text-green-700" : "text-gray-700"
                            }`}
                          >
                            {m.label}
                          </p>
                          <p className="text-xs text-gray-400">
                            {m.orderCount} pedidos · {m.discountPercent}%
                            descuento
                          </p>
                        </div>
                        {achieved && (
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            ✓ Completado
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "rewards" && (
        <div className="space-y-4">
          {/* Available Rewards */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              Cupones disponibles
            </h3>
            {availableRewards.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  No tienes cupones disponibles
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Canjea tus puntos o alcanza un hito para obtener cupones
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableRewards.map((reward) => (
                  <div
                    key={reward._id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {reward.type === "milestone" ? (
                          <Trophy className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Gift className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="font-semibold text-blue-700">
                          {reward.discountType === "percentage"
                            ? `${reward.discountValue}% descuento`
                            : `$${reward.discountValue} MXN`}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {reward.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Vence:{" "}
                        {new Date(reward.expiresAt).toLocaleDateString("es-MX")}
                      </p>
                    </div>
                    <button
                      onClick={() => copyCode(reward.couponCode)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer flex-shrink-0 ml-3"
                    >
                      {copiedCode === reward.couponCode ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          {reward.couponCode}
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Used / Expired Rewards */}
          {rewardHistory.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Historial de cupones
              </h3>
              <div className="space-y-2">
                {rewardHistory.map((r) => (
                  <div
                    key={r._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-75"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 truncate">
                        {r.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        {r.couponCode} ·{" "}
                        {r.used ? "Utilizado" : "Expirado"}
                      </p>
                    </div>
                    {r.used ? (
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Historial de puntos
          </h3>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Aún no tienes movimientos
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tus puntos aparecerán aquí cuando realices y recibas pedidos
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {transactionIcons[tx.type] || (
                        <Star className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">
                        {tx.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3 text-right">
                    <span
                      className={`text-sm font-semibold block ${
                        tx.points > 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {tx.points > 0 ? "+" : ""}
                      {tx.points} pts
                    </span>
                    <span className="text-xs text-gray-400">
                      {tx.points > 0 ? "+" : "-"}${Math.abs(tx.points * (config.pointValue || 0.1)).toFixed(2)} MXN
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "redeem" && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            Canjear puntos
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Convierte tus puntos en un cupón de descuento. Mínimo{" "}
            {config.minRedeemPoints || 100} puntos.
          </p>

          {(loyalty.points || 0) < (config.minRedeemPoints || 100) ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Necesitas al menos {config.minRedeemPoints || 100} puntos para
                canjear
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tienes {loyalty.points || 0} puntos actualmente
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cuántos puntos quieres canjear?
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    min={config.minRedeemPoints || 100}
                    max={loyalty.points || 0}
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    placeholder={`${config.minRedeemPoints || 100} - ${
                      loyalty.points || 0
                    }`}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={() =>
                      setRedeemAmount(String(loyalty.points || 0))
                    }
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Máximo
                  </button>
                </div>
                {redeemAmount && parseInt(redeemAmount) > 0 && (
                  <p className="text-sm text-blue-600 mt-2">
                    = ${(parseInt(redeemAmount) * (config.pointValue || 0.1)).toFixed(2)}{" "}
                    MXN de descuento
                  </p>
                )}
              </div>

              <button
                onClick={handleRedeem}
                disabled={
                  loading ||
                  !redeemAmount ||
                  parseInt(redeemAmount) < (config.minRedeemPoints || 100) ||
                  parseInt(redeemAmount) > (loyalty.points || 0)
                }
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Canjeando..." : "Canjear puntos"}
              </button>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {redeemResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-green-700 mb-1">
                    ¡Cupón generado!
                  </p>
                  <div className="bg-white border border-green-300 rounded-lg px-4 py-2 inline-block">
                    <span className="text-lg font-bold text-green-700 tracking-wider">
                      {redeemResult.reward?.couponCode}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    ${redeemResult.reward?.discountValue} MXN de descuento ·
                    Válido por 30 días
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Puntos restantes: {redeemResult.remainingPoints}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
