"use client";
import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useSetting } from "@context/SettingContext";

const PAYMENT_LABELS = {
  Cash: "Pago Contra Entrega",
  Card: "Tarjeta de Crédito",
};

const STATUS_CONFIG = {
  pedido:     { color: "orange", label: "Pedido" },
  empaquetado:{ color: "blue",   label: "Empaquetado" },
  en_reparto: { color: "purple", label: "En Reparto" },
  entregado:  { color: "green",  label: "Entregado" },
  cancelado:  { color: "red",    label: "Cancelado" },
};

const OrderHistory = ({ order }) => {
  const { globalSetting } = useSetting();
  const currency = globalSetting?.default_currency || "$";
  const norm = order.status?.toLowerCase() || "";
  const cfg = STATUS_CONFIG[norm];

  return (
    <>
      <td className="py-3 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
        <span className="uppercase text-sm font-medium">
          {order?._id?.substring(20, 24)}
        </span>
      </td>
      <td className="px-3 py-3 text-sm whitespace-nowrap text-gray-500">
        <span className="text-sm">
          {dayjs(order.createdAt).locale("es").format("D [de] MMMM [de] YYYY")}
        </span>
      </td>

      <td className="px-3 py-3 text-sm whitespace-nowrap text-gray-500">
        <span className="text-sm">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
      </td>
      <td className="px-3 py-3 text-sm whitespace-nowrap text-gray-500">
        {cfg ? (
          <span className="flex items-center gap-x-2 justify-start">
            <div className={`flex-none rounded-full bg-${cfg.color}-400/10 p-1 text-${cfg.color}-400`}>
              <div className="size-1.5 rounded-full bg-current"></div>
            </div>
            <span className="block">{cfg.label}</span>
          </span>
        ) : (
          <span className="block">{order.status}</span>
        )}
      </td>

      <td className="px-3 py-3 text-sm whitespace-nowrap text-gray-500">
        <span className="text-sm">{order.shippingOption}</span>
      </td>
      <td className="px-3 py-3 text-sm whitespace-nowrap text-gray-500">
        <span className="text-sm">
          {currency}
          {order.shippingCost}
        </span>
      </td>
      <td className="px-3 py-3 text-sm whitespace-nowrap text-gray-600">
        <span className="text-sm font-bold">
          {currency}
          {parseFloat(order?.total).toFixed(2)}
        </span>
      </td>
    </>
  );
};

export default OrderHistory;
