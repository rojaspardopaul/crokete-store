import { baseURL, handleResponse } from "@services/CommonService";
import { getHeaders } from "@lib/auth-server";

// ==========================================
// Server-side (RSC) vet services
// ==========================================

// Public config (no auth required)
const getPublicVetConfig = async () => {
  try {
    const response = await fetch(`${baseURL}/vet/public-config`, {
      cache: "no-store",
    });
    const data = await handleResponse(response);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Public list of active veterinarians
const getActiveVeterinarians = async () => {
  try {
    const response = await fetch(`${baseURL}/vet/veterinarians/public`, {
      cache: "no-store",
    });
    const data = await handleResponse(response);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Get my pets
const getMyPets = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${baseURL}/vet/my-pets`, {
      headers,
      cache: "no-store",
    });
    const data = await handleResponse(response);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Get my appointments
const getMyAppointments = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${baseURL}/vet/my-appointments`, {
      headers,
      cache: "no-store",
    });
    const data = await handleResponse(response);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Get available slots for a vet on a date
const getAvailableSlots = async (veterinarianId, date) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(
      `${baseURL}/vet/available-slots?veterinarianId=${veterinarianId}&date=${date}`,
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

// Get personalized price info
const getMyPriceInfo = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${baseURL}/vet/my-price-info`, {
      headers,
      cache: "no-store",
    });
    const data = await handleResponse(response);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export {
  getPublicVetConfig,
  getActiveVeterinarians,
  getMyPets,
  getMyAppointments,
  getAvailableSlots,
  getMyPriceInfo,
};
