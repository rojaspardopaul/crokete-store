import { baseURL, handleResponse } from "@services/CommonService";

const getShowingBrands = async () => {
  try {
    const response = await fetch(`${baseURL}/brands/show`, {
      next: { revalidate: 300 },
    });

    const brands = await handleResponse(response);
    return { brands, error: null };
  } catch (error) {
    return { brands: [], error: error.message };
  }
};

export { getShowingBrands };
