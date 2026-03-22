import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoRemoveSharp,
} from "react-icons/io5";

import useUtilsFunction from "@hooks/useUtilsFunction";

const CategoryCard = ({ title, icon, nested, id, onClose }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();

  const [show, setShow] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState({
    id: "",
    show: false,
  });

  // Always navigates using the TOP-LEVEL parent's id so the category filter
  // (which only shows parent categories) reflects the correct selection.
  const handleSearch = () => {
    const name = title.toLowerCase().replace(/[^A-Z0-9]+/gi, "-");
    router.push(`/search?category=${name}&_id=${id}`);
    if (onClose) {
      onClose();
    }
  };

  const toggleExpand = () => {
    setShow(!show);
  };

  const handleSubNestedToggle = (childId) => {
    setShowSubCategory({
      id: childId,
      show: showSubCategory.id === childId ? !showSubCategory.show : true,
    });
  };

  return (
    <>
      <div className="p-2 flex items-center rounded-md hover:bg-gray-50 w-full">
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

        {/*
          - Parent WITH children: clicking the title expands subcategories (no navigation).
          - Parent WITHOUT children: clicking the title navigates and closes the dropdown.
        */}
        <div
          onClick={() => {
            if (nested?.length > 0) {
              toggleExpand();
            } else {
              handleSearch();
            }
          }}
          className="ml-3 text-sm font-medium flex-1 cursor-pointer hover:text-kachabazar-600"
        >
          {title}
        </div>

        {/* Arrow always toggles expand */}
        {nested?.length > 0 && (
          <span
            onClick={toggleExpand}
            className="cursor-pointer text-gray-400 hover:text-kachabazar-600"
          >
            {show ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
          </span>
        )}
      </div>

      {/* Nested categories (first level children) */}
      {show && nested.length > 0 && (
        <ul className="pl-6 pb-3 pt-1 -mt-1">
          {nested.map((children) => (
            <li key={children._id}>
              {children.children.length > 0 ? (
                <div className="flex items-center py-1">
                  <span className="text-xs text-gray-500 pr-2">
                    <IoRemoveSharp />
                  </span>
                  {/* Child with sub-children: clicking name navigates with PARENT id */}
                  <div
                    onClick={handleSearch}
                    className="flex-1 text-sm text-gray-600 hover:text-kachabazar-600 cursor-pointer"
                  >
                    {showingTranslateValue(children.name)}
                  </div>
                  <span
                    onClick={() => handleSubNestedToggle(children._id)}
                    className="cursor-pointer text-gray-400 hover:text-kachabazar-600"
                  >
                    {showSubCategory.id === children._id &&
                    showSubCategory.show ? (
                      <IoChevronDownOutline />
                    ) : (
                      <IoChevronForwardOutline />
                    )}
                  </span>
                </div>
              ) : (
                /* Child without sub-children: clicking navigates with PARENT id */
                <div
                  onClick={handleSearch}
                  className="flex items-center py-1 text-sm text-gray-600 hover:text-kachabazar-600 cursor-pointer"
                >
                  <span className="text-xs text-gray-500 pr-2">
                    <IoRemoveSharp />
                  </span>
                  {showingTranslateValue(children.name)}
                </div>
              )}

              {/* Sub children (grandchildren) — also navigate with top-level parent id */}
              {showSubCategory.id === children._id && showSubCategory.show && (
                <ul className="pl-6 pb-3">
                  {children.children.map((subChildren) => (
                    <li
                      key={subChildren._id}
                      onClick={handleSearch}
                      className="flex items-center py-1 text-sm text-gray-600 hover:text-kachabazar-600 cursor-pointer"
                    >
                      <span className="text-xs text-gray-500 pr-2">
                        <IoRemoveSharp />
                      </span>
                      {showingTranslateValue(subChildren.name)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default CategoryCard;

