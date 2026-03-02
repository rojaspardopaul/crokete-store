"use client";

import { useState, useCallback } from "react";
import requests, { setToken } from "@services/httpServices";

const useLoyalty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initToken = useCallback((token) => {
    setToken(token);
  }, []);

  // Redeem points for a discount coupon
  const redeemPoints = useCallback(async (points) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requests.post("/loyalty/redeem", { points });
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Error al canjear puntos";
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  }, []);

  // Apply a loyalty reward coupon at checkout
  const applyReward = useCallback(async (couponCode, orderTotal) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requests.post("/loyalty/apply-reward", {
        couponCode,
        orderTotal,
      });
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al aplicar recompensa";
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  }, []);

  // Mark reward as used after successful checkout
  const useReward = useCallback(async (couponCode, orderId) => {
    try {
      await requests.post("/loyalty/use-reward", { couponCode, orderId });
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }, []);

  return {
    loading,
    error,
    initToken,
    redeemPoints,
    applyReward,
    useReward,
  };
};

export default useLoyalty;
