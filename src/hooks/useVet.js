"use client";

import { useState, useCallback } from "react";
import requests, { setToken } from "@services/httpServices";

const useVet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initToken = useCallback((token) => {
    setToken(token);
  }, []);

  // ==========================================
  // Pet CRUD
  // ==========================================

  const createPet = useCallback(async (petData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requests.post("/vet/my-pets", petData);
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Error al crear mascota";
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  }, []);

  const updatePet = useCallback(async (petId, petData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requests.put(`/vet/my-pets/${petId}`, petData);
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al actualizar mascota";
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  }, []);

  const deletePet = useCallback(async (petId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requests.put(`/vet/my-pets/${petId}`, {
        status: "inactive",
      });
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al eliminar mascota";
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  }, []);

  // ==========================================
  // Appointments
  // ==========================================

  const requestAppointment = useCallback(async (appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requests.post("/vet/appointments", appointmentData);
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al solicitar consulta";
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  }, []);

  const cancelAppointment = useCallback(async (appointmentId, reason) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requests.put(
        `/vet/my-appointments/${appointmentId}/cancel`,
        { reason }
      );
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al cancelar consulta";
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  }, []);

  // ==========================================
  // Queries
  // ==========================================

  const getAvailableSlots = useCallback(async (veterinarianId, date, duration) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requests.get(
        `/vet/available-slots?veterinarianId=${veterinarianId}&date=${date}&duration=${duration || 30}`
      );
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al obtener horarios";
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  }, []);

  const getAvailableDates = useCallback(async (veterinarianId, month, duration) => {
    try {
      const result = await requests.get(
        `/vet/available-dates?veterinarianId=${veterinarianId}&month=${month}&duration=${duration || 30}`
      );
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const getPriceInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await requests.get("/vet/my-price-info");
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al obtener información de precios";
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  }, []);

  return {
    loading,
    error,
    initToken,
    createPet,
    updatePet,
    deletePet,
    requestAppointment,
    cancelAppointment,
    getAvailableSlots,
    getAvailableDates,
    getPriceInfo,
  };
};

export default useVet;
