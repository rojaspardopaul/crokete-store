"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import useUtilsFunction from "@hooks/useUtilsFunction";

const CategoryCard = ({ title, icon, relatedBrands = [], id, onClose }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();
  const [open, setOpen] = useState(false);

  const navigateCategory = (e) => {
    e.stopPropagation();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    router.push(`/search?category=${slug}&_id=${id}`);
    onClose?.();
  };

  const navigateBrand = (brand) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    router.push(`/search?category=${slug}&_id=${id}&brand=${brand._id}`);
    onClose?.();
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center">
        {/* Category — click navigates */}
        <button
          type="button"
          onClick={navigateCategory}
          className="flex items-center gap-3 flex-1 px-3 py-3 text-left hover:bg-kachabazar-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-kachabazar-50 flex items-center justify-center flex-shrink-0">
            {icon ? (
              <Image src={icon} width={18} height={18} alt={title} />
            ) : (
              <span className="text-kachabazar-600 text-xs font-bold">
                {title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </button>

        {/* Expand brands — obvious button with count label */}
        {relatedBrands.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-l border-gray-100 transition-colors flex-shrink-0 ${
              open
                ? "text-kachabazar-600 bg-kachabazar-50"
                : "text-gray-400 hover:text-kachabazar-600 hover:bg-kachabazar-50"
            }`}
          >
            <span className="whitespace-nowrap">{relatedBrands.length} marcas</span>
            {open ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Brand chips — shown when expanded */}
      {open && relatedBrands.length > 0 && (
        <div className="px-3 pb-3 pt-2 border-t border-gray-100 bg-gray-50/60">
          <div className="flex flex-wrap gap-1.5">
            {relatedBrands.map((brand) => (
              <button
                key={brand._id}
                type="button"
                onClick={() => navigateBrand(brand)}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:border-kachabazar-400 hover:text-kachabazar-600 hover:bg-kachabazar-50 transition-colors"
              >
                {showingTranslateValue(brand.name)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
