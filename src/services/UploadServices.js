"use server";

import { baseURL, handleResponse } from "@services/CommonService";
import { getHeaders } from "@lib/auth-server";

/**
 * Sube una imagen del cliente (foto de perfil o foto de reseña) y devuelve su
 * URL pública.
 *
 * Antes el componente subía directamente a Cloudinary desde el navegador con un
 * upload preset público. Al pasar a Supabase Storage eso ya no es posible: la
 * clave de servicio no puede salir del servidor, así que la subida va contra el
 * backend, que además normaliza la imagen a webp con un tamaño uniforme.
 *
 * @param {string} dataUri data-URI de la imagen (JPG, PNG o WEBP)
 * @returns {Promise<{url?: string, error?: string}>}
 */
const uploadCustomerImage = async (dataUri) => {
  try {
    const response = await fetch(`${baseURL}/upload/customer-image`, {
      method: "POST",
      cache: "no-store",
      headers: await getHeaders(),
      body: JSON.stringify({ file: dataUri }),
    });

    const { url } = await handleResponse(response);
    return { url };
  } catch (error) {
    return { error: error.message };
  }
};

export { uploadCustomerImage };
