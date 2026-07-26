"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReactToPrint } from "react-to-print";
import { CreditCard, MapPin, Printer, X } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

import MainDrawer from "./MainDrawer";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { SidebarContext } from "@context/SidebarContext";
import { useSetting } from "@context/SettingContext";
import OrderItems from "@components/order/OrderItems";
import { Button } from "@components/ui/button";

const PDFDownloadSection = dynamic(
  () => import("@components/invoice/PDFDownloadSection"),
  {
    ssr: false,
    loading: () => (
      <Button variant="create" disabled className="w-full justify-center">
        Cargando PDF...
      </Button>
    ),
  }
);

const STATUS_CONFIG = {
  pedido:      { bg: "bg-orange-50",  text: "text-orange-700",  dot: "bg-orange-400",  border: "border-orange-200",  label: "Pedido" },
  empaquetado: { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400",    border: "border-blue-200",    label: "Empaquetado" },
  en_reparto:  { bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-400",  border: "border-purple-200",  label: "En Reparto" },
  entregado:   { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", border: "border-emerald-200", label: "Entregado" },
  cancelado:   { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-400",     border: "border-red-200",     label: "Cancelado" },
};

const PAYMENT_LABELS = {
  Cash: "Pago Contra Entrega",
  Card: "Tarjeta de Crédito",
  Stripe: "Tarjeta de Crédito",
};

const OrderDetailsDrawer = ({ data }) => {
  const printRef = useRef();
  const { drawerOpen, closeDrawer } = useContext(SidebarContext);
  const { globalSetting } = useSetting();
  const { getNumberTwo, currency } = useUtilsFunction();

  const handlePrintInvoice = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Pedido-${data?.invoice}`,
  });

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const statusCfg = STATUS_CONFIG[data?.status?.toLowerCase() || ""];

  return (
    <MainDrawer open={drawerOpen} onClose={closeDrawer}>
      <div className="flex flex-col h-full bg-white">

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 bg-white shrink-0">
          <div className="flex flex-col gap-1 min-w-0 pr-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Detalle del Pedido
            </p>
            <h2 className="text-lg font-bold text-gray-900 leading-none">
              Pedido #{data?.invoice}
            </h2>
            {data?.createdAt && (
              <p className="text-xs text-gray-400 mt-0.5">
                {dayjs(data.createdAt).locale("es").format("D [de] MMMM [de] YYYY")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {statusCfg && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            )}
            <button
              onClick={closeDrawer}
              className="print:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div ref={printRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

          {/* Products */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Productos
              </h3>
            </div>
            <div className="px-4">
              <OrderItems drawer data={data} currency={currency} />
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Dirección de Envío
              </h3>
            </div>
            <div className="px-4 py-4 text-sm text-gray-600 space-y-0.5">
              <p className="font-semibold text-gray-900">{data?.user_info?.name}</p>
              <p className="text-gray-500">{data?.user_info?.email}</p>
              <p>
                {data?.user_info?.calle} {data?.user_info?.numExterior}
                {data?.user_info?.numInterior ? ` Int. ${data.user_info.numInterior}` : ""}
              </p>
              {data?.user_info?.colonia && (
                <p>Col. {data.user_info.colonia}</p>
              )}
              <p>
                {data?.user_info?.municipio}
                {data?.user_info?.postalCode ? `, C.P. ${data.user_info.postalCode}` : ""}
              </p>
              {data?.user_info?.referencias && (
                <p className="text-gray-400 italic text-xs pt-1">
                  Ref: {data.user_info.referencias}
                </p>
              )}
              {data?.user_info?.contact && (
                <p className="font-medium text-gray-800 pt-1">{data.user_info.contact}</p>
              )}
            </div>
          </div>

          {/* Payment summary */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Resumen de Pago
              </h3>
            </div>
            <div className="px-4 py-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Método</span>
                <span className="font-semibold text-gray-800">
                  {PAYMENT_LABELS[data?.paymentMethod] || data?.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Envío</span>
                <span className="font-semibold text-gray-800">
                  {currency}{getNumberTwo(data?.shippingCost)}
                </span>
              </div>
              {Number(data?.discount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Descuento</span>
                  <span className="font-semibold text-emerald-600">
                    -{currency}{getNumberTwo(data?.discount)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="text-xl font-bold text-emerald-600">
                  {currency}{getNumberTwo(data?.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer: buttons (siempre apilados, nunca encimados) ── */}
        <div className="shrink-0 border-t border-gray-100 bg-gray-50 px-5 py-4 print:hidden">
          <div className="flex flex-col gap-3">
            {isClient && (
              <PDFDownloadSection data={data} globalSetting={globalSetting} fullWidth />
            )}
            <Button
              onClick={handlePrintInvoice}
              variant="import"
              className="w-full justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimir Pedido
            </Button>
          </div>
        </div>
      </div>
    </MainDrawer>
  );
};

export default dynamic(() => Promise.resolve(OrderDetailsDrawer), { ssr: false });
