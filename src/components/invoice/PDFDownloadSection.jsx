"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import InvoicePDF from "@components/invoice/InvoiceForDownload";
import { Button } from "@components/ui/button";

const PDFDownloadSection = ({ data, globalSetting }) => {
  return (
    <PDFDownloadLink
      document={<InvoicePDF data={data} globalSetting={globalSetting} />}
      fileName={`Pedido-${data.invoice}.pdf`}
    >
      {({ loading }) => (
        <Button variant="create">
          {loading ? "Generando..." : "Descargar PDF"}{" "}
          <Download className="ml-2" />
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadSection;
