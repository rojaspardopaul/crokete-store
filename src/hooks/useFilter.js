import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const useFilter = (data) => {
  const [pendiente, setPending] = useState([]);
  const [procesando, setProcessing] = useState([]);
  const [entregado, setDelivered] = useState([]);
  const [sortedField, setSortedField] = useState("");
  const router = useRouter();

  // console.log("sortedfield", sortedField, data);

  const productData = useMemo(() => {
    let services = data;
    //filter user order
    if (router.pathname === "/user/dashboard") {
      const orderPending = services?.filter(
        (statusP) => statusP.status === "pedido"
      );
      setPending(orderPending);

      const orderProcessing = services?.filter(
        (statusO) => statusO.status === "empaquetado"
      );
      setProcessing(orderProcessing);

      const orderDelivered = services?.filter(
        (statusD) => statusD.status === "entregado"
      );
      setDelivered(orderDelivered);
    }

    //service sorting with low and high price
    if (sortedField === "Low") {
      services = services?.sort(
        (a, b) => a.prices.price < b.prices.price && -1
      );
    }
    if (sortedField === "High") {
      services = services?.sort(
        (a, b) => a.prices.price > b.prices.price && -1
      );
    }

    return services;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedField, data]);

  return {
    productData,
    pendiente,
    procesando,
    entregado,
    setSortedField,
  };
};

export default useFilter;
