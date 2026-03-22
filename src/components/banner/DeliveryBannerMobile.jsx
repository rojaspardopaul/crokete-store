import { Truck } from "lucide-react";

const DeliveryBannerMobile = ({ freeShippingThreshold = 599 }) => {
  return (
    <div className="block sm:hidden bg-gradient-to-r from-kachabazar-600 to-kachabazar-700 text-white">
      <div className="max-w-screen-2xl mx-auto px-3 py-2">
        <div className="flex items-center justify-center gap-2">
          <Truck className="w-4 h-4 flex-shrink-0" />
          <p className="text-xs font-medium text-center">
            Entregas el mismo día y{" "}
            <span className="font-bold text-yellow-300">gratis</span> a partir de{" "}
            <span className="font-bold text-yellow-300">${freeShippingThreshold}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBannerMobile;
