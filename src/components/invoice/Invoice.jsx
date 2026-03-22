import dayjs from "dayjs";
import "dayjs/locale/es";
import React from "react";
import Link from "next/link";
import Image from "next/image";

//internal import
import OrderTable from "@components/order/OrderTable";
import useUtilsFunction from "@hooks/useUtilsFunction";

const PAYMENT_LABELS = {
  Cash: "Pago Contra Entrega",
  Card: "Tarjeta de Crédito",
};

const Invoice = ({ data, printRef, globalSetting }) => {
  // console.log("invoice data", data);
  const currency = globalSetting?.default_currency || "$";

  const { getNumberTwo } = useUtilsFunction();

  const statusNorm = data?.status?.toLowerCase() || "";

  const STATUS_LABELS = {
    pedido: "Pedido",
    empaquetado: "Empaquetado",
    en_reparto: "En Reparto",
    entregado: "Entregado",
    cancelado: "Cancelado",
  };

  return (
    <div ref={printRef}>
      <div className="bg-indigo-50 p-8 rounded-t-xl">
        <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col lg:items-center justify-between pb-4 border-b border-gray-50">
          <div>
            <h1 className="font-bold text-2xl uppercase">Comprobante de Pedido</h1>
            <h6 className="text-gray-700">
              Estado:{" "}
              {statusNorm === "entregado" && (
                <span className="text-kachabazar-500 capitalize">{STATUS_LABELS[statusNorm]}</span>
              )}
              {statusNorm === "pedido" && (
                <span className="text-orange-500 capitalize">{STATUS_LABELS[statusNorm]}</span>
              )}
              {statusNorm === "cancelado" && (
                <span className="text-red-500 capitalize">{STATUS_LABELS[statusNorm]}</span>
              )}
              {statusNorm === "empaquetado" && (
                <span className="text-indigo-500 capitalize">{STATUS_LABELS[statusNorm]}</span>
              )}
              {statusNorm === "en_reparto" && (
                <span className="text-purple-500 capitalize">{STATUS_LABELS[statusNorm]}</span>
              )}
              {statusNorm === "deleted" && (
                <span className="text-red-700 capitalize">{data?.status}</span>
              )}
              {!["entregado","pedido","cancelado","empaquetado","en_reparto","deleted"].includes(statusNorm) && data?.status && (
                <span className="text-gray-600 capitalize">{data?.status}</span>
              )}
            </h6>
          </div>
          <div className="lg:text-right text-left">
            <h2 className="text-lg font-semibold mt-4 lg:mt-0 md:mt-0">
              <Link href="/">
                <Image
                  width={110}
                  height={40}
                  src="/logo/logo-color.svg"
                  alt="logo"
                />
              </Link>
            </h2>
            <p className="text-sm text-gray-500">
              {globalSetting?.address ||
                "Cecilia Chapman, 561-4535 Nulla LA, <br /> United States 96522"}
            </p>
          </div>
        </div>
        <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col justify-between pt-4">
          <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
            <span className="font-bold text-sm uppercase text-gray-600 block">
              Fecha
            </span>
            <span className="text-sm text-gray-500 block">
              {data?.createdAt !== undefined && (
                <span>{dayjs(data?.createdAt).locale("es").format("D [de] MMMM [de] YYYY")}</span>
              )}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
            <span className="font-bold text-sm uppercase text-gray-600 block">
              Pedido No.
            </span>
            <span className="text-sm text-gray-500 block">
              #{data?.invoice}
            </span>
          </div>
          <div className="flex flex-col lg:text-right text-left">
            <span className="font-bold text-sm uppercase text-gray-600 block">
              Datos de Envío
            </span>
            <span className="text-sm text-gray-500 block">
              {data?.user_info?.name} <br />
              {data?.user_info?.email}{" "}
              <span className="ml-2">{data?.user_info?.contact}</span>
              <br />
              {data?.user_info?.calle} {data?.user_info?.numExterior}
              {data?.user_info?.numInterior ? ` Int. ${data.user_info.numInterior}` : ""}
              <br />
              {data?.user_info?.colonia}, {data?.user_info?.municipio}, Jalisco{" "}
              C.P. {data?.user_info?.postalCode}
            </span>
          </div>
        </div>
      </div>
      <div className="overflow-hidden lg:overflow-visible px-4 sm:px-8 my-10">
        <div className="-my-2 overflow-x-auto">
          <table className="table-auto min-w-full border border-gray-100 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-xs bg-gray-100">
                <th
                  scope="col"
                  className="font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-left"
                >
                  Sr.
                </th>
                <th
                  scope="col"
                  className="font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-left"
                >
                  Nombre del Producto
                </th>
                <th
                  scope="col"
                  className="font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-center"
                >
                  Cantidad
                </th>
                <th
                  scope="col"
                  className="font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-center"
                >
                  Precio Unitario
                </th>

                <th
                  scope="col"
                  className="font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-right"
                >
                  Monto
                </th>
              </tr>
            </thead>
            <OrderTable data={data} currency={currency} />
          </table>
        </div>
      </div>

      <div className="border-t border-b border-gray-100 p-10 bg-kachabazar-50">
        <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col justify-between pt-4">
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold text-sm uppercase text-gray-600 block">
              Método de Pago
            </span>
            <span className="text-sm text-gray-500 font-semibold block">
              {PAYMENT_LABELS[data?.paymentMethod] || data?.paymentMethod}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold text-sm uppercase text-gray-600 block">
              Costo de Envío
            </span>
            <span className="text-sm text-gray-500 font-semibold block">
              {currency}
              {getNumberTwo(data?.shippingCost)}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold text-sm uppercase text-gray-600 block">
              Descuento
            </span>
            <span className="text-sm text-gray-500 font-semibold block">
              {currency}
              {getNumberTwo(data?.discount)}
            </span>
          </div>
          <div className="flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold text-sm uppercase text-gray-600 block">
              Monto Total
            </span>
            <span className="text-2xl font-bold text-emerald-600 block">
              {currency}
              {getNumberTwo(data?.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
