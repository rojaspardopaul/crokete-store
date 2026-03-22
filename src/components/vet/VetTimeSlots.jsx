"use client";

import { Calendar, AlertCircle, X } from "lucide-react";

export default function VetTimeSlots({
  slots = [],
  selectedSlot,
  onSelectSlot,
  loading = false,
  selectedDate,
}) {
  // No date selected yet
  if (!selectedDate) {
    return (
      <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center min-h-[280px]">
        <Calendar className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-sm text-gray-400 text-center font-medium">
          Selecciona una fecha en el calendario
        </p>
        <p className="text-xs text-gray-300 mt-1">
          para ver los horarios disponibles
        </p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[280px]">
        <div className="w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-gray-500 font-medium">
          Cargando horarios...
        </p>
      </div>
    );
  }

  // No slots for this date
  if (slots.length === 0) {
    return (
      <div className="bg-orange-50 rounded-2xl border border-orange-200 p-8 flex flex-col items-center justify-center min-h-[280px]">
        <AlertCircle className="w-12 h-12 text-orange-300 mb-3" />
        <p className="text-sm text-orange-700 font-semibold text-center">
          No hay horarios para esta fecha
        </p>
        <p className="text-xs text-orange-500 mt-1">
          Intenta seleccionar otro día
        </p>
      </div>
    );
  }

  const availableCount = slots.filter(
    (s) => s.status === "available" || (!s.status && s.available)
  ).length;
  const occupiedCount = slots.filter((s) => s.status === "occupied").length;
  const pastCount = slots.filter(
    (s) => s.status === "past" || (!s.status && !s.available)
  ).length;

  // Format the selected date for display
  const dateDisplay = new Date(selectedDate + "T12:00:00").toLocaleDateString(
    "es-MX",
    { weekday: "long", day: "numeric", month: "long" }
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-700 capitalize">
          {dateDisplay}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {availableCount} disponible{availableCount !== 1 ? "s" : ""}
          </span>
          {occupiedCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {occupiedCount} ocupado{occupiedCount !== 1 ? "s" : ""}
            </span>
          )}
          {pastCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              {pastCount} pasado{pastCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Slots grid */}
      <div className="p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((slot) => {
            const time = new Date(slot.start).toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const isSelected = selectedSlot === slot.start;
            const status =
              slot.status || (slot.available ? "available" : "past");

            // Available slot
            if (status === "available") {
              return (
                <button
                  key={slot.start}
                  onClick={() => onSelectSlot(slot.start)}
                  className={`
                    relative px-3 py-3 rounded-xl text-sm font-bold
                    transition-all duration-200 cursor-pointer border-2
                    ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400 hover:shadow-md hover:scale-[1.03] active:scale-95"
                    }
                  `}
                >
                  {time}
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border border-blue-100">
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                    </span>
                  )}
                </button>
              );
            }

            // Occupied slot
            if (status === "occupied") {
              return (
                <div
                  key={slot.start}
                  className="relative px-3 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-300 border-2 border-red-100 cursor-not-allowed"
                  title="Horario ocupado"
                >
                  <span className="line-through decoration-red-300">
                    {time}
                  </span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-2.5 h-2.5 text-red-400" />
                  </span>
                </div>
              );
            }

            // Past / disabled slot
            return (
              <div
                key={slot.start}
                className="px-3 py-3 rounded-xl text-sm font-medium bg-gray-50 text-gray-300 border-2 border-gray-100 cursor-not-allowed"
                title="Horario no disponible"
              >
                {time}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-emerald-200 border border-emerald-300" />
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-red-200 border border-red-300" />
          <span>Ocupado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-gray-200 border border-gray-300" />
          <span>No disponible</span>
        </div>
      </div>
    </div>
  );
}
