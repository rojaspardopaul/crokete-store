"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { getUserSession } from "@lib/auth-client";
import requests from "@services/httpServices";

const LoyaltyContext = createContext(null);

export function useLoyaltyContext() {
  return useContext(LoyaltyContext);
}

export function LoyaltyProvider({ children }) {
  const userInfo = getUserSession();

  const [config, setConfig] = useState(null);
  const [loyalty, setLoyalty] = useState(null);
  const [showEducationalModal, setShowEducationalModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch public config (no auth required) — always fetched
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await requests.get("/loyalty/public-config");
        if (data?.enabled) {
          setConfig(data);
        }
      } catch {
        // silently fail — loyalty features just won't show
      }
    };
    fetchConfig();
  }, []);

  // Fetch user's loyalty data (auth required)
  useEffect(() => {
    if (!userInfo?.token || !config) return;
    const fetchLoyalty = async () => {
      try {
        requests.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
        const data = await requests.get("/loyalty/my");
        setLoyalty(data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchLoyalty();
  }, [userInfo?.token, config]);

  // Mark loading done if no user
  useEffect(() => {
    if (!userInfo?.token) setLoading(false);
  }, [userInfo?.token]);

  const openModal = useCallback(() => setShowEducationalModal(true), []);
  const closeModal = useCallback(() => setShowEducationalModal(false), []);

  // Refresh loyalty data (e.g., after a purchase)
  const refreshLoyalty = useCallback(async () => {
    if (!userInfo?.token) return;
    try {
      requests.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const data = await requests.get("/loyalty/my");
      setLoyalty(data);
    } catch {
      // silently fail
    }
  }, [userInfo?.token]);

  const value = useMemo(
    () => ({
      config,
      loyalty,
      loading,
      isLoggedIn: !!userInfo?.token,
      showEducationalModal,
      openModal,
      closeModal,
      refreshLoyalty,
    }),
    [config, loyalty, loading, userInfo?.token, showEducationalModal, openModal, closeModal, refreshLoyalty]
  );

  // Don't render provider if loyalty is disabled
  if (config === null && !loading) {
    return (
      <LoyaltyContext.Provider value={{ config: null, loyalty: null, loading: false, isLoggedIn: !!userInfo?.token, showEducationalModal, openModal, closeModal, refreshLoyalty }}>
        {children}
      </LoyaltyContext.Provider>
    );
  }

  return (
    <LoyaltyContext.Provider value={value}>
      {children}
    </LoyaltyContext.Provider>
  );
}
