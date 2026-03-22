//internal import

import SearchScreen from "@components/search/SearchScreen";
import { getShowingAttributes } from "@services/AttributeServices";
import { getShowingCategory } from "@services/CategoryService";
import { getShowingStoreProducts } from "@services/ProductServices";
import { getGlobalSetting } from "@services/SettingServices";
import { getShowingPets } from "@services/PetServices";
import { getShowingBrands } from "@services/BrandServices";
// import Loading from "./loading";

// import { useSearchParams } from "next/navigation";

export async function generateMetadata({ searchParams }) {
  const { _id, query } = await searchParams;

  const { products, error } = await getShowingStoreProducts({
    category: _id ? _id : "",
    title: query ? encodeURIComponent(query) : "",
  });

  const product = products[0];

  return {
    title: `${product?.title?.en || "Buscar"} | Crokete`,
    description: product?.description?.en,
    keywords: [product?.tags],
    openGraph: {
      images: [product?.image],
    },
  };
}

const Search = async ({ searchParams }) => {
  const { _id, query, pet, brand } = await searchParams;

  // Parallelize all data fetches
  const [
    { products, error },
    { attributes },
    { categories },
    { globalSetting },
    { pets },
    { brands },
  ] = await Promise.all([
    getShowingStoreProducts({
      category: _id ? _id : "",
      title: query ? encodeURIComponent(query) : "",
      pet: pet || "",
      brand: brand || "",
    }),
    getShowingAttributes(),
    getShowingCategory(),
    getGlobalSetting(),
    getShowingPets(),
    getShowingBrands(),
  ]);
  const currency = globalSetting?.default_currency || "$";

  return (
    <>
      <SearchScreen
        products={products}
        attributes={attributes}
        categories={categories}
        currency={currency}
        pets={pets}
        brands={brands}
        currentQuery={query || ""}
        currentCategory={_id || ""}
        currentPet={pet || ""}
        currentBrand={brand || ""}
      />
    </>
  );
};

export default Search;
