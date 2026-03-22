import { cache } from "react";
import { baseURL, handleResponse } from "@services/CommonService";

const getShowingStoreProducts = cache(async ({
  category = "",
  title = "",
  slug = "",
  pet = "",
  brand = "",
}) => {
  try {
    // console.log("slug::", slug);
    const response = await fetch(
      `${baseURL}/products/store?category=${category}&title=${title}&slug=${slug}&pet=${pet}&brand=${brand}`,
      {
        cache: "no-store",
      }
    );

    const products = await handleResponse(response);

    return {
      error: null,
      reviews: products.reviews,
      products: products.products,
      relatedProducts: products.relatedProducts,
      popularProducts: products.popularProducts,
      discountedProducts: products.discountedProducts,
    };
  } catch (error) {
    return {
      products: [],
      relatedProducts: [],
      popularProducts: [],
      discountedProducts: [],
      error: error.message,
    };
  }
});

export { getShowingStoreProducts };
