"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import InvoicePDF from "@components/invoice/InvoiceForDownload";
import { Button } from "@components/ui/button";

const PDFDownloadSection = ({ data, globalSetting, fullWidth }) => {
  return (
    <PDFDownloadLink
      document={<InvoicePDF data={data} globalSetting={globalSetting} />}
      fileName={`Pedido-${data.invoice}.pdf`}
      className={fullWidth ? "w-full" : undefined}
    >
      {({ loading }) => (
        <Button variant="create" className={fullWidth ? "w-full justify-center gap-2" : "gap-2"}>
          <Download className="w-4 h-4" />
          {loading ? "Generando..." : "Descargar PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadSection;
