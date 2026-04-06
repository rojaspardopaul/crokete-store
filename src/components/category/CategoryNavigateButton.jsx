"use client";

import { useRouter } from "next/navigation";
import { IoChevronForwardSharp } from "react-icons/io5";

//internal import

import useUtilsFunction from "@hooks/useUtilsFunction";

const CategoryNavigateButton = ({ category }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();

  const handleCategoryClick = (id, categoryName, brandId = "") => {
    const category_name = categoryName
      .toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");
    const url = `/search?category=${category_name}&_id=${id}${brandId ? `&brand=${brandId}` : ""}`;
    router.push(url);
  };

  const previewBrands = category?.relatedBrands?.slice(0, 3) || [];

  return (
    <>
      <div className="pl-4">
        <h3
          onClick={() =>
            handleCategoryClick(
              category._id,
              showingTranslateValue(category?.name)
            )
          }
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-400 font-medium leading-tight line-clamp-1  group-hover"
        >
          {showingTranslateValue(category?.name)}
        </h3>
        <ul className="pt-1 mt-1">
          {previewBrands.length > 0 ? (
            previewBrands.map((brand) => (
              <li key={brand._id} className="pt-1">
                <button
                  type="button"
                onClick={() =>
                  handleCategoryClick(
                      category._id,
                      showingTranslateValue(category?.name),
                      brand._id
                    )
                  }
                  className="flex hover:translate-x-2 transition-transform duration-300 items-center text-xs text-gray-400 cursor-pointer"
                >
                  <span className="text-xs text-gray-400 ">
                    <IoChevronForwardSharp />
                  </span>
                  {showingTranslateValue(brand?.name)}
                </button>
              </li>
            ))
          ) : (
            <li className="pt-1 text-xs text-gray-400">Ver todos los productos</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default CategoryNavigateButton;
