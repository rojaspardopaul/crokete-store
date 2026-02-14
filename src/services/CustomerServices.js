"use server";

import { baseURL, handleResponse } from "@services/CommonService";
import { getHeaders, getUserServerSession } from "@lib/auth-server";

const loginCustomer = async ({ email, password }) => {
  // console.log("registerEmail", email, "password", password);
  // return;
  try {
    const response = await fetch(`${baseURL}/customer/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const userInfo = await handleResponse(response);

    // revalidatePath("/auth/login");
    // console.log("userInfo", userInfo);
    return {
      userInfo,
    };
  } catch (error) {
    // console.log("error on login::", error.message);
    return { error: error.message };
  }
};

const registerCustomer = async (token) => {
  try {
    const response = await fetch(`${baseURL}/customer/register/${token}`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    
    const user = await handleResponse(response);
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};
const signUpWithOauthProvider = async ({ name, email, image }) => {
  // return;
  try {
    const response = await fetch(`${baseURL}/customer/signup/oauth`, {
      cache: "no-cache",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, image }),
    });

    const res = await handleResponse(response);
    // console.log("res", res);
    return { res };
  } catch (error) {
    return { error: error.message };
  }
};
const forgetPassword = async ({ email }) => {
  try {
    const response = await fetch(`${baseURL}/customer/forget-password`, {
      method: "PUT",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await handleResponse(response);
    return { result, error: null };
  } catch (error) {
    return { result: null, error: error.message };
  }
};

const resetPassword = async ({ token, newPassword }) => {
  try {
    const response = await fetch(`${baseURL}/customer/reset-password`, {
      method: "PUT",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const result = await handleResponse(response);
    return { result, error: null };
  } catch (error) {
    return { result: null, error: error.message };
  }
};

const getShippingAddress = async ({ id = "" }) => {
  try {
    // return;
    const userInfo = await getUserServerSession();
    // console.log("userInfo", userInfo);
    const response = await fetch(
      `${baseURL}/customer/shipping/address/${userInfo?.id}?id=${id}`,
      {
        // cache: "no-cache",
        headers: await getHeaders(),
      }
    );

    const res = await handleResponse(response);
    // console.log("shippingAddress", res);

    return {
      shippingAddress: res.shippingAddress,
    };
  } catch (error) {
    // console.log("error", error);
    return { error: error.message };
  }
};

export {
  loginCustomer,
  registerCustomer,
  signUpWithOauthProvider,
  forgetPassword,
  resetPassword,
  getShippingAddress,
};
