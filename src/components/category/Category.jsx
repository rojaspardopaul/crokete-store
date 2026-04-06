//internal import
import CategoryCard from "@components/category/CategoryCard";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getMenuCategories } from "@utils/categoryTree";

const Category = ({ categories, categoryError, onClose }) => {
  const { showingTranslateValue } = useUtilsFunction();
  const topLevelCategories = getMenuCategories(categories);

  return (
    <div className="flex flex-col w-full h-full bg-white cursor-pointer scrollbar-hide">
      <div className="w-full max-h-full">
        {categoryError ? (
          <p className="flex justify-center align-middle items-center m-auto text-xl text-red-500">
            <span> {categoryError}</span>
          </p>
        ) : (
          <div className="relative grid gap-2 p-6">
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
        )}
      </div>
    </div>
  );
};

export default Category;
