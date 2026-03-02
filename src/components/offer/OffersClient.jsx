"use client";

import { useState, useCallback } from "react";
import { Gift, Star, Copy, Check, Trophy, Clock, Tag, ChevronRight } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import { useLoyaltyContext } from "@context/LoyaltyContext";

const OffersClient = ({ rewardsData }) => {
  const ctx = useLoyaltyContext();
  const available = rewardsData?.available || [];
  const used = rewardsData?.used || [];

  return (
    <div className="space-y-10">
      {/* Header section */}
      <div className="text-center max-w-xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Trophy className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-800">Mis Recompensas</h2>
        </div>
        <p className="text-sm text-gray-500">
          Aquí encontrarás todos los cupones que has ganado con tus compras.
          Cópialos y úsalos en el checkout.
        </p>
        {ctx?.config && (
          <button
            onClick={ctx.openModal}
            className="mt-2 inline-flex items-center gap-1 text-sm text-kachabazar-600 hover:text-kachabazar-800 font-medium transition cursor-pointer"
          >
            ¿Cómo funciona el programa?
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Available rewards */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
          <Gift className="h-5 w-5 text-green-600" />
          Cupones disponibles
          {available.length > 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {available.length}
            </span>
          )}
        </h3>

        {available.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
            <Gift className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              No tienes cupones disponibles en este momento.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Sigue comprando para ganar recompensas automáticas.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {available.map((reward) => (
              <RewardCard key={reward._id} reward={reward} />
            ))}
          </div>
        )}
      </div>

      {/* Used rewards */}
      {used.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
            <Clock className="h-5 w-5 text-gray-400" />
            Cupones utilizados
          </h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {used.map((reward) => (
              <RewardCard key={reward._id} reward={reward} isUsed />
            ))}
          </div>
        </div>
      )}

      {/* CTA to rewards dashboard */}
      <div className="text-center">
        <Link
          href="/user/rewards"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-yellow-600 transition-all"
        >
          <Star className="h-4 w-4" />
          Ver panel completo de recompensas
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

const RewardCard = ({ reward, isUsed = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(reward.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [reward.couponCode]);

  const isExpired = reward.expiresAt && dayjs().isAfter(dayjs(reward.expiresAt));

  return (
    <div
      className={`rounded-xl border p-5 transition ${
        isUsed || isExpired
          ? "border-gray-200 bg-gray-50 opacity-70"
          : "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isUsed || isExpired
                ? "bg-gray-200 text-gray-500"
                : "bg-green-100 text-green-600"
            }`}
          >
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-lg font-bold ${isUsed || isExpired ? "text-gray-500" : "text-green-700"}`}>
              {reward.discountValue}%
              <span className="text-sm font-medium ml-1">descuento</span>
            </p>
            <p className="text-xs text-gray-500">
              {reward.type === "milestone" ? "🏆 Hito de compra" : "💫 Canje de puntos"}
            </p>
          </div>
        </div>
        {isUsed && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
            Usado
          </span>
        )}
        {isExpired && !isUsed && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
            Expirado
          </span>
        )}
      </div>

      {/* Coupon code */}
      <div className="flex items-center gap-2 mb-2">
        <code
          className={`flex-1 text-center text-sm font-bold tracking-wider px-3 py-2 rounded-lg border border-dashed ${
            isUsed || isExpired
              ? "bg-gray-100 text-gray-500 border-gray-300"
              : "bg-white text-green-800 border-green-300"
          }`}
        >
          {reward.couponCode}
        </code>
        {!isUsed && !isExpired && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-medium text-green-700 hover:text-green-900 transition cursor-pointer px-2 py-2 rounded-lg border border-green-200 bg-white hover:bg-green-50"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> ¡Copiado!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copiar
              </>
            )}
          </button>
        )}
      </div>

      {/* Expiry */}
      {reward.expiresAt && (
        <p className="text-[11px] text-gray-500 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {isUsed
            ? `Usado el ${dayjs(reward.usedAt).format("DD/MM/YYYY")}`
            : isExpired
            ? "Cupón expirado"
            : `Válido hasta ${dayjs(reward.expiresAt).format("DD/MM/YYYY")}`}
        </p>
      )}

      {reward.description && (
        <p className="text-[11px] text-gray-400 mt-1">{reward.description}</p>
      )}
    </div>
  );
};

export default OffersClient;
