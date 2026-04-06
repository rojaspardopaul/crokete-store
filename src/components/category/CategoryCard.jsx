import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoChevronDownOutline, IoChevronForwardOutline } from "react-icons/io5";

import useUtilsFunction from "@hooks/useUtilsFunction";

const CategoryCard = ({ title, icon, relatedBrands = [], id, onClose }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();

  const [show, setShow] = useState(false);

  const handleCategorySearch = () => {
    const name = title.toLowerCase().replace(/[^A-Z0-9]+/gi, "-");
    router.push(`/search?category=${name}&_id=${id}`);

    if (onClose) {
      onClose();
    }
  };

  const handleBrandSearch = (brand) => {
    const name = title.toLowerCase().replace(/[^A-Z0-9]+/gi, "-");
    router.push(`/search?category=${name}&_id=${id}&brand=${brand._id}`);

    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 transition-colors hover:border-kachabazar-200 hover:bg-kachabazar-50/70">
        <div className="flex items-center gap-3">
          {icon ? (
            <Image src={icon} width={18} height={18} alt="Category" />
          ) : (
            <Image
              src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
              width={18}
              height={18}
              alt="category"
            />
          )}

          <button
            type="button"
            onClick={handleCategorySearch}
            className="flex-1 text-left text-sm font-semibold text-gray-700 hover:text-kachabazar-600"
          >
            {title}
          </button>

          {relatedBrands.length > 0 && (
            <button
              type="button"
              onClick={() => setShow((currentValue) => !currentValue)}
              className="text-gray-400 hover:text-kachabazar-600"
              aria-label={`Mostrar marcas de ${title}`}
            >
              {show ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
            </button>
          )}
        </div>

        {show && relatedBrands.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-gray-200 pt-3 pl-7">
            {relatedBrands.map((brand) => (
              <li key={brand._id}>
                <button
                  type="button"
                  onClick={() => handleBrandSearch(brand)}
                  className="text-left text-sm text-gray-600 hover:text-kachabazar-600"
                >
                  {showingTranslateValue(brand.name)}
                </button>
              </li>
            ))}
          </ul>
        )}

        {!show && relatedBrands.length > 0 && (
          <p className="mt-2 pl-7 text-xs text-gray-400">
            {relatedBrands.length} marcas disponibles
          </p>
        )}
      </div>
    </>
  );
};

export default CategoryCard;

