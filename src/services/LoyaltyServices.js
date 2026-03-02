import { baseURL, handleResponse } from "@services/CommonService";
import { getHeaders } from "@lib/auth-server";

// ==========================================
// Server-side (RSC) loyalty services
// ==========================================

// Get customer's loyalty summary
const getMyLoyalty = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${baseURL}/loyalty/my`, {
      headers,
      cache: "no-store",
    });
    const data = await handleResponse(response);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Get customer's point transaction history
const getPointHistory = async (page = 1, limit = 20) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(
      `${baseURL}/loyalty/history?page=${page}&limit=${limit}`,
      {
        headers,
        cache: "no-store",
      }
    );
    const data = await handleResponse(response);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Get customer's available rewards
const getAvailableRewards = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${baseURL}/loyalty/rewards`, {
      headers,
      cache: "no-store",
    });
    const data = await handleResponse(response);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export { getMyLoyalty, getPointHistory, getAvailableRewards };
