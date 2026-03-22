"use client";

import { useState, useEffect, useRef } from "react";
import { zmgPostalCodes, zmgMunicipios } from "@utils/zmgPostalCodes";

const DEBOUNCE_MS = 500;
const API_TIMEOUT_MS = 3000;
// API gratuita, sin API key — devuelve colonias para CPs de México
const API_URL = "https://api.zippopotam.us/MX";

const usePostalCodeLookup = (postalCode) => {
  const [colonias, setColonias] = useState([]);
  const [municipio, setMunicipio] = useState("");
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    // Limpiar si el CP no tiene 5 dígitos
    if (!postalCode || postalCode.length !== 5 || !/^\d{5}$/.test(postalCode)) {
      setColonias([]);
      setMunicipio("");
      setEstado("");
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      lookupPostalCode(postalCode);
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [postalCode]);

  const lookupPostalCode = async (cp) => {
    setLoading(true);
    setError(null);

    // Intentar API externa primero
    try {
      abortRef.current = new AbortController();
      const timeoutId = setTimeout(() => abortRef.current?.abort(), API_TIMEOUT_MS);

      const res = await fetch(`${API_URL}/${cp}`, {
        signal: abortRef.current.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const places = data.places || [];
        if (places.length > 0) {
          const stateValue = places[0]["state"] || "";
          const coloniasFromApi = places.map((p) => p["place name"]);
          // Verificar que el CP pertenece a Jalisco / ZMG
          if (stateValue.toLowerCase().includes("jalisco")) {
            setColonias(coloniasFromApi);
            setMunicipio(extractMunicipio(cp, coloniasFromApi));
            setEstado("Jalisco");
            setLoading(false);
            return;
          }
        }
        // CP no está en Jalisco
        fallbackOrReject(cp);
        return;
      }
      // Respuesta no-ok → fallback
      fallbackLocal(cp);
    } catch {
      // Error de red / timeout / abort → fallback
      fallbackLocal(cp);
    }
  };

  const extractMunicipio = (cp, apiColonias) => {
    // El JSON local tiene el municipio directo; intentar usarlo primero
    const local = zmgPostalCodes[cp];
    if (local) return local.municipio;
    // Heurística: la API no da municipio directamente, pero el dato local sí
    return "";
  };

  const fallbackLocal = (cp) => {
    const local = zmgPostalCodes[cp];
    if (local) {
      setColonias(local.colonias);
      setMunicipio(local.municipio);
      setEstado("Jalisco");
      setError(null);
    } else {
      setColonias([]);
      setMunicipio("");
      setEstado("");
      setError("Solo realizamos envíos en la Zona Metropolitana de Guadalajara.");
    }
    setLoading(false);
  };

  const fallbackOrReject = (cp) => {
    const local = zmgPostalCodes[cp];
    if (local) {
      setColonias(local.colonias);
      setMunicipio(local.municipio);
      setEstado("Jalisco");
      setError(null);
    } else {
      setColonias([]);
      setMunicipio("");
      setEstado("");
      setError("Solo realizamos envíos en la Zona Metropolitana de Guadalajara.");
    }
    setLoading(false);
  };

  return { colonias, municipio, estado, loading, error };
};

export default usePostalCodeLookup;
