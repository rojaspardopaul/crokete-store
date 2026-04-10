"use client";

import Link from "next/link";
import { Tag, ShoppingBag, ArrowRight } from "lucide-react";
import DiscountedCard from "@components/product/DiscountedCard";

const OffersClient = ({ discountedProducts = [], attributes = [], currency }) => {
  if (discountedProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 mb-6">
          <Tag className="h-10 w-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          No hay ofertas disponibles en este momento
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
          Estamos preparando nuevos descuentos para ti. Mientras tanto, explora nuestro catálogo completo.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-kachabazar-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-kachabazar-600 transition-all"
        >
          <ShoppingBag className="h-4 w-4" />
          Ver todos los productos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
        {discountedProducts.map((product) => (
          <DiscountedCard
            key={product._id}
            product={product}
            currency={currency}
            attributes={attributes}
          />
        ))}
      </div>
    </div>
  );
};

export default OffersClient;
