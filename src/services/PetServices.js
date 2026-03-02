import { baseURL, handleResponse } from "@services/CommonService";

const getShowingPets = async () => {
  try {
    const response = await fetch(`${baseURL}/pets/show`, {
      next: { revalidate: 300 },
    });

    const pets = await handleResponse(response);
    return { pets, error: null };
  } catch (error) {
    return { pets: [], error: error.message };
  }
};

export { getShowingPets };
