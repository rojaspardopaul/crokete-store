"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { getUserSession } from "@lib/auth-client";
import requests, { setToken } from "@services/httpServices";

const VetContext = createContext(null);

export function useVetContext() {
  return useContext(VetContext);
}

export function VetProvider({ children }) {
  const userInfo = getUserSession();

  const [config, setConfig] = useState(null);
  const [myPets, setMyPets] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch public config (no auth required) — cached in sessionStorage
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Check sessionStorage first to avoid refetching on every navigation
        const cached = sessionStorage.getItem("vet_config");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.enabled) setConfig(parsed);
          return;
        }
        const data = await requests.get("/vet/public-config");
        if (data?.enabled) {
          setConfig(data);
          sessionStorage.setItem("vet_config", JSON.stringify(data));
        }
      } catch {
        // silently fail — vet features just won't show
      }
    };
    fetchConfig();
  }, []);

  // Fetch user's vet data (auth required, only if vet is enabled)
  useEffect(() => {
    if (!userInfo?.token || !config) return;
    const fetchData = async () => {
      try {
        setToken(userInfo.token);
        const [pets, appointments] = await Promise.all([
          requests.get("/vet/my-pets"),
          requests.get("/vet/my-appointments"),
        ]);
        setMyPets(Array.isArray(pets) ? pets : pets?.pets || []);
        setMyAppointments(
          Array.isArray(appointments)
            ? appointments
            : appointments?.appointments || []
        );
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userInfo?.token, config]);

  // Mark loading done if no user
  useEffect(() => {
    if (!userInfo?.token) setLoading(false);
  }, [userInfo?.token]);

  // Refresh pets
  const refreshPets = useCallback(async () => {
    if (!userInfo?.token) return;
    try {
      setToken(userInfo.token);
      const pets = await requests.get("/vet/my-pets");
      setMyPets(Array.isArray(pets) ? pets : pets?.pets || []);
    } catch {
      // silently fail
    }
  }, [userInfo?.token]);

  // Refresh appointments
  const refreshAppointments = useCallback(async () => {
    if (!userInfo?.token) return;
    try {
      setToken(userInfo.token);
      const appointments = await requests.get("/vet/my-appointments");
      setMyAppointments(
        Array.isArray(appointments)
          ? appointments
          : appointments?.appointments || []
      );
    } catch {
      // silently fail
    }
  }, [userInfo?.token]);

  const value = useMemo(
    () => ({
      config,
      myPets,
      myAppointments,
      loading,
      isLoggedIn: !!userInfo?.token,
      refreshPets,
      refreshAppointments,
    }),
    [
      config,
      myPets,
      myAppointments,
      loading,
      userInfo?.token,
      refreshPets,
      refreshAppointments,
    ]
  );

  return (
    <VetContext.Provider value={value}>{children}</VetContext.Provider>
  );
}
