import { Badge } from "@components/ui/badge";

const Stock = ({ stock, card }) => {
  return (
    <>
     {stock <= 0 ? (
        <span className={`text-red-700 inline-flex items-center justify-center ${card ? 'text-xs' : 'text-sm'}`}>
          Agotado
        </span>
      ) : (
        <>
          <span
            className={`${
              card
                ? "text-xs text-gray-500"
                : "inline-flex items-center justify-center text-sm text-gray-500 font-medium"
            }`}
          >
            En stock:
            <span className="text-green-600 pl-1 font-semibold">{stock} </span>
          </span>
        </>
      )}
    </>
  );
};

export default Stock;
