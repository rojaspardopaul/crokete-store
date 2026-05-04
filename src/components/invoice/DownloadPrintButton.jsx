"use client";

import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import dynamic from "next/dynamic";
import { Printer } from "lucide-react";

// internal imports
import Invoice from "@components/invoice/Invoice";
import { Button } from "@components/ui/button";
import { useSetting } from "@context/SettingContext";
import useUtilsFunction from "@hooks/useUtilsFunction";

const PDFDownloadSection = dynamic(
  () => import("@components/invoice/PDFDownloadSection"),
  {
    ssr: false,
    loading: () => (
      <Button variant="create" disabled>
        Cargando PDF...
      </Button>
    ),
  }
);

const DownloadPrintButton = ({ data }) => {
  const { globalSetting, storeCustomization } = useSetting();
  const targetRef = useRef(null);
  const { showingTranslateValue } = useUtilsFunction();
  const dashboard = storeCustomization?.dashboard;

  const handlePrintInvoice = useReactToPrint({
    contentRef: targetRef,
    documentTitle: `Pedido-${data?.invoice}`,
  });

  // Flag to only render PDFDownloadLink after client mount
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // console.log("globalSetting", globalSetting, "data", data);

  return (
    <>
      <div className="bg-kachabazar-100 rounded-md mb-5 px-4 py-3">
        <label>
          {showingTranslateValue(dashboard?.invoice_message_first)}{" "}
          <span className="font-bold text-kachabazar-600">
            {data?.user_info?.name},
          </span>{" "}
          {showingTranslateValue(dashboard?.invoice_message_last)}
        </label>
      </div>

      <Invoice data={data} printRef={targetRef} globalSetting={globalSetting} />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="bg-white p-6 rounded-b-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            {isClient && (
              <PDFDownloadSection
                data={data}
                globalSetting={globalSetting}
              />
            )}
            <Button onClick={handlePrintInvoice} variant="import" className="gap-2">
              <Printer className="w-4 h-4" />
              {showingTranslateValue(dashboard?.print_button) || "Imprimir Pedido"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(DownloadPrintButton), {
  ssr: false,
});
