"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import CategoryCard from "@components/category/CategoryCard";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getMenuCategories } from "@utils/categoryTree";

const Category = ({ categories, categoryError, onClose, megaMenu }) => {
  const { showingTranslateValue } = useUtilsFunction();
  const router = useRouter();
  const topLevelCategories = getMenuCategories(categories);
  const [hoveredId, setHoveredId] = useState(topLevelCategories[0]?._id ?? null);

  if (categoryError) {
    return (
      <p className="flex justify-center items-center m-auto text-sm text-red-500 p-6">
        {categoryError}
      </p>
    );
  }

  // ── Mobile / drawer: accordion list ──────────────────────────────────
  if (!megaMenu) {
    return (
      <div className="flex flex-col w-full bg-white">
        <div className="flex flex-col gap-2 p-4">
          {topLevelCategories.map((category) => (
            <CategoryCard
              key={category._id}
              id={category._id}
              icon={category.icon}
              onClose={onClose}
              relatedBrands={category.relatedBrands || []}
              title={showingTranslateValue(category?.name)}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Desktop: two-panel mega-menu ─────────────────────────────────────
  const hovered = topLevelCategories.find((c) => c._id === hoveredId);

  const goCategory = (cat) => {
    const name = showingTranslateValue(cat.name);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    router.push(`/search?category=${slug}&_id=${cat._id}`);
    onClose?.();
  };

  const goBrand = (cat, brand) => {
    const name = showingTranslateValue(cat.name);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    router.push(`/search?category=${slug}&_id=${cat._id}&brand=${brand._id}`);
    onClose?.();
  };

  return (
    <div className="flex w-full min-h-72">
      {/* Left panel: category list */}
      <div className="w-48 flex-shrink-0 border-r border-gray-100 bg-gray-50/60 py-2 overflow-y-auto">
        {topLevelCategories.map((cat) => {
          const isActive = hoveredId === cat._id;
          const catName = showingTranslateValue(cat.name);
          return (
            <button
              key={cat._id}
              type="button"
              onMouseEnter={() => setHoveredId(cat._id)}
              onClick={() => goCategory(cat)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors ${
                isActive
                  ? "bg-white text-kachabazar-600 font-semibold border-r-2 border-kachabazar-500"
                  : "text-gray-600 hover:bg-white hover:text-gray-800 font-medium"
              }`}
            >
              {cat.icon && (
                <Image
                  src={cat.icon}
                  width={16}
                  height={16}
                  alt={catName}
                  className="flex-shrink-0"
                />
              )}
              <span className="truncate">{catName}</span>
            </button>
          );
        })}
      </div>

      {/* Right panel: brands for hovered category */}
      <div className="flex-1 p-4 bg-white overflow-y-auto">
        {hovered && (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">
                {showingTranslateValue(hovered.name)}
              </h3>
              <button
                type="button"
                onClick={() => goCategory(hovered)}
                className="text-xs text-kachabazar-600 hover:text-kachabazar-700 font-semibold"
              >
                Ver todos →
              </button>
            </div>

            {hovered.relatedBrands?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {hovered.relatedBrands.map((brand) => (
                  <button
                    key={brand._id}
                    type="button"
                    onClick={() => goBrand(hovered, brand)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600 hover:border-kachabazar-400 hover:text-kachabazar-600 hover:bg-kachabazar-50 transition-colors"
                  >
                    {showingTranslateValue(brand.name)}
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => goCategory(hovered)}
                className="mt-2 text-xs text-kachabazar-600 hover:text-kachabazar-700 font-medium"
              >
                Ver productos →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Category;
