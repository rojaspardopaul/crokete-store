"use client";
import React from "react";
import dayjs from "dayjs";
import { useSetting } from "@context/SettingContext";

const OrderHistory = ({ order }) => {
  const { globalSetting } = useSetting();
  const currency = globalSetting?.default_currency || "$";

  return (
    <>
      <td className="py-3 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
        <span className="uppercase text-sm font-medium">
          {order?._id?.substring(20, 24)}
        </span>
      </td>
      <td className="px-3 py-3 text-sm whitespace-nowrap text-gray-500">
        <span className="text-sm">
          {dayjs(order.createdAt).format("MMMM D, YYYY")}
        </span>
      </td>

      <td className="px-3 py-3 text-sm whitespace-nowrap text-gray-500">
        <span className="text-sm">{order.paymentMethod}</span>
      </td>
      <td className="px-3 py-3 text-sm whitespace-nowrap text-gray-500">
        {(order.status === "Entregado" || order.status === "entregado") && (
          <span className="flex items-center gap-x-2 justify-start">
            {" "}
            <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
              <div className="size-1.5 rounded-full bg-current"></div>
            </div>
            <span className="block">{order.status}</span>
          </span>
        )}
        {(order.status === "Pendiente" || order.status === "pendiente") && (
          <span className="flex items-center gap-x-2 justify-start">
            <div className="flex-none rounded-full bg-orange-400/10 p-1 text-orange-400">
              <div className="size-1.5 rounded-full bg-current"></div>
            </div>
            <span className="block">{order.status}</span>
          </span>
        )}
        {(order.status === "Cancelado" || order.status === "cancelado") && (
          <span className="flex items-center gap-x-2 justify-start">
            <div className="flex-none rounded-full bg-red-400/10 p-1 text-red-400">
              <div className="size-1.5 rounded-full bg-current"></div>
            </div>
            <span className="block">{order.status}</span>
          </span>
        )}
        {(order.status === "Procesando" || order.status === "procesando") && (
          <span className="flex items-center gap-x-2 justify-start">
            <div className="flex-none rounded-full bg-kachabazar-400/10 p-1 text-kachabazar-400">
              <div className="size-1.5 rounded-full bg-current"></div>
            </div>
            <span className="block">{order.status}</span>
          </span>
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
