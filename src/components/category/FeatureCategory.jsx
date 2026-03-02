import Image from "next/image";

//internal import
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getShowingCategory } from "@services/CategoryService";
import CategoryNavigateButton from "@components/category/CategoryNavigateButton";

const FeatureCategory = async () => {
  const { categories, error } = await getShowingCategory();

  return (
    <>
      {error ? (
        <CMSkeletonTwo count={10} height={20} error={error} loading={false} />
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3">
          {categories[0]?.children?.map((category, i) => (
            <li className="group" key={i + 1}>
              <div className="flex w-full h-full rounded-2xl border border-kachabazar-100 bg-white dark:bg-zinc-900 p-4 cursor-pointer transition-all duration-300 ease-in-out group-hover:border-kachabazar-300 group-hover:shadow-md group-hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-kachabazar-50 flex items-center justify-center overflow-hidden">
                    {category.icon ? (
                      <Image
                        src={category?.icon}
                        alt="category"
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    ) : (
                      <Image
                        src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                        alt="category"
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    )}
                  </div>

                  <CategoryNavigateButton
                    category={{
                      ...category,
                      name: category.name,
                      description: category.description,
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default FeatureCategory;
