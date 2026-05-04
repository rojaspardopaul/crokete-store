"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Eye } from "lucide-react";
import { IoBagHandle } from "react-icons/io5";

import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useSetting } from "@context/SettingContext";
import Pagination from "@components/pagination/Pagination";

const OrderDetailsDrawer = dynamic(
  () => import("@components/drawer/OrderDetailsDrawer"),
  { ssr: false }
);

const STATUS_CONFIG = {
  pedido:      { bg: "bg-orange-50",  text: "text-orange-700",  dot: "bg-orange-400",  label: "Pedido" },
  empaquetado: { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400",    label: "Empaquetado" },
  en_reparto:  { bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-400",  label: "En Reparto" },
  entregado:   { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", label: "Entregado" },
  cancelado:   { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-400",     label: "Cancelado" },
};

const PAYMENT_LABELS = {
  Cash: "Contraentrega",
  Card: "Tarjeta",
  Stripe: "Tarjeta",
  PayPal: "PayPal",
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status?.toLowerCase() || ""];
  if (!cfg) return <span className="text-sm text-gray-500">{status}</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const RecentOrder = ({ data, error, link, title }) => {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const { showingTranslateValue } = useUtilsFunction();
  const { globalSetting } = useSetting();
  const { setDrawerOpen } = useContext(SidebarContext);
  const currency = globalSetting?.default_currency || "$";

  const handleChangePage = (page) => router.push(`?page=${page}`);

  const handleOrderDetails = (order) => {
    setOrderData(order);
    setDrawerOpen(true);
  };

  if (error) {
    return (
      <div className="text-center my-10 mx-auto w-11/12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            {error.includes("sesión") || error.includes("expired") || error.includes("inválida")
              ? "Sesión Expirada"
              : "Error al cargar pedidos"}
          </h2>
          <p className="text-sm text-red-500 mb-4">
            {error.includes("sesión") || error.includes("expired") || error.includes("inválida")
              ? "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión."
              : error}
          </p>
          <button
            onClick={() => { window.location.href = "/login"; }}
            className="bg-kachabazar-500 hover:bg-kachabazar-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (!data?.orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-kachabazar-50 rounded-full p-5 mb-4">
          <IoBagHandle className="text-4xl text-kachabazar-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 mb-1">Aún no tienes pedidos</h3>
        <p className="text-sm text-gray-400">Cuando realices tu primer pedido, aparecerá aquí.</p>
      </div>
    );
  }

  return (
    <>
      {orderData && <OrderDetailsDrawer data={orderData} />}
      <div className="max-w-screen-2xl mx-auto">
        <h3 className="text-base font-semibold text-gray-700 mb-4">
          {showingTranslateValue(title) || "Pedidos Recientes"}
        </h3>

        {/* ── Mobile: card per order ── */}
        <div className="md:hidden space-y-3">
          {data.orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Pedido</p>
                  <p className="text-sm font-bold text-gray-800">
                    #{order._id?.substring(20, 24).toUpperCase()}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs mb-3">
                <div>
                  <p className="text-gray-400 mb-0.5">Fecha</p>
                  <p className="font-medium text-gray-700">
                    {dayjs(order.createdAt).locale("es").format("D MMM YYYY")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Pago</p>
                  <p className="font-medium text-gray-700">
                    {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Envío</p>
                  <p className="font-medium text-gray-700">{order.shippingOption || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Total</p>
                  <p className="font-bold text-gray-800">
                    {currency}{parseFloat(order.total || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-50 pt-3">
                {link ? (
                  <Link
                    href={`/order/${order._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-kachabazar-600 hover:text-kachabazar-700 bg-kachabazar-50 hover:bg-kachabazar-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver detalle
                  </Link>
                ) : (
                  <button
                    onClick={() => handleOrderDetails(order)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-kachabazar-600 hover:text-kachabazar-700 bg-kachabazar-50 hover:bg-kachabazar-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver detalle
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Desktop: table ── */}
        <div className="hidden md:block overflow-hidden border border-gray-100 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                {["ID Pedido", "Fecha", "Método", "Estado", "Envío", "Costo Envío", "Total", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {data.orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-800">
                    #{order._id?.substring(20, 24).toUpperCase()}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {dayjs(order.createdAt).locale("es").format("D MMM YYYY")}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {order.shippingOption || "—"}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {currency}{parseFloat(order.shippingCost || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-800">
                    {currency}{parseFloat(order.total || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {link ? (
                      <Link
                        href={`/order/${order._id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-kachabazar-600 hover:text-kachabazar-700 bg-kachabazar-50 hover:bg-kachabazar-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleOrderDetails(order)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-kachabazar-600 hover:text-kachabazar-700 bg-kachabazar-50 hover:bg-kachabazar-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.totalDoc > 10 && (
          <div className="mt-4">
            <Pagination
              totalResults={data.totalDoc}
              resultsPerPage={10}
              onChange={handleChangePage}
              label="Order Page Navigation"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default RecentOrder;
