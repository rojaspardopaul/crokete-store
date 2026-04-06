import { baseURL, handleResponse } from "@services/CommonService";

const getShowingBrands = async (category = "") => {
  try {
    const searchParams = new URLSearchParams();

    if (category) {
      searchParams.set("category", category);
    }

    const response = await fetch(
      `${baseURL}/brands/show${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
      {
        next: { revalidate: 300 },
      }
    );

    const brands = await handleResponse(response);
    return { brands, error: null };
  } catch (error) {
    return { brands: [], error: error.message };
  }
};

export { getShowingBrands };
