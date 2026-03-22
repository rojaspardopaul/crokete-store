"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAY_LABELS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Returns 0=Monday .. 6=Sunday (ISO week)
function getFirstDayOfWeek(year, month) {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

function formatDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function VetCalendar({
  selectedDate,
  onSelectDate,
  onMonthChange,
  minDate,
  maxDate,
  workingDays = [1, 2, 3, 4, 5],
  availableDates = null,
  loadingDates = false,
}) {
  const today = useMemo(() => {
    const d = new Date();
    return formatDateStr(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const initialMonth = useMemo(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split("-").map(Number);
      return { year: y, month: m - 1 };
    }
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => {
      const next =
        prev.month === 0
          ? { year: prev.year - 1, month: 11 }
          : { ...prev, month: prev.month - 1 };
      onMonthChange?.(
        `${next.year}-${String(next.month + 1).padStart(2, "0")}`
      );
      return next;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const next =
        prev.month === 11
          ? { year: prev.year + 1, month: 0 }
          : { ...prev, month: prev.month + 1 };
      onMonthChange?.(
        `${next.year}-${String(next.month + 1).padStart(2, "0")}`
      );
      return next;
    });
  };

  const canGoPrev = useMemo(() => {
    if (!minDate) return true;
    const [minY, minM] = minDate.split("-").map(Number);
    return (
      currentMonth.year > minY ||
      (currentMonth.year === minY && currentMonth.month > minM - 1)
    );
  }, [currentMonth, minDate]);

  const canGoNext = useMemo(() => {
    if (!maxDate) return true;
    const [maxY, maxM] = maxDate.split("-").map(Number);
    return (
      currentMonth.year < maxY ||
      (currentMonth.year === maxY && currentMonth.month < maxM - 1)
    );
  }, [currentMonth, maxDate]);

  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = getFirstDayOfWeek(year, month);
    const prevMonthDays = getDaysInMonth(
      month === 0 ? year - 1 : year,
      month === 0 ? 11 : month - 1
    );

    const days = [];

    // Previous month fill
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        dateStr: null,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateStr(year, month, d);
      const jsDay = new Date(year, month, d).getDay(); // 0=Sun
      const isWorkingDay = workingDays.includes(jsDay);
      const isBeforeMin = minDate && dateStr < minDate;
      const isAfterMax = maxDate && dateStr > maxDate;
      const isFullyBooked =
        availableDates !== null &&
        isWorkingDay &&
        !isBeforeMin &&
        !isAfterMax &&
        !availableDates.includes(dateStr);
      const isDisabled =
        !isWorkingDay || !!isBeforeMin || !!isAfterMax || isFullyBooked;

      days.push({
        day: d,
        isCurrentMonth: true,
        dateStr,
        isToday: dateStr === today,
        isSelected: dateStr === selectedDate,
        isDisabled,
        isWorkingDay,
        isFullyBooked,
      });
    }

    // Next month fill (complete 6 rows = 42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        dateStr: null,
      });
    }

    return days;
  }, [currentMonth, minDate, maxDate, workingDays, selectedDate, today, availableDates]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden select-none">
      {/* Month navigation header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700">
        <button
          onClick={goToPrevMonth}
          disabled={!canGoPrev}
          className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h4 className="text-white font-semibold text-base sm:text-lg tracking-wide">
          {MONTH_NAMES[currentMonth.month]} {currentMonth.year}
        </h4>
        <button
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 px-3 pt-3">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-2"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day cells grid */}
      <div className="grid grid-cols-7 px-3 pb-3 gap-1 relative">
        {loadingDates && (
          <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center rounded-b-2xl">
            <div className="w-6 h-6 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {calendarDays.map((dayObj, idx) => {
          if (!dayObj.isCurrentMonth) {
            return (
              <div
                key={`pad-${idx}`}
                className="aspect-square flex items-center justify-center"
              >
                <span className="text-xs text-gray-200">{dayObj.day}</span>
              </div>
            );
          }

          const { day, isSelected, isToday, isDisabled, isFullyBooked, dateStr } = dayObj;

          return (
            <button
              key={dateStr}
              onClick={() => !isDisabled && onSelectDate(dateStr)}
              disabled={isDisabled}
              title={isFullyBooked ? "Sin horarios disponibles" : undefined}
              className={`
                aspect-square flex items-center justify-center rounded-xl text-sm font-semibold
                transition-all duration-200 relative
                ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110 z-10"
                    : isFullyBooked
                      ? "text-red-300 cursor-not-allowed bg-red-50/50 line-through decoration-red-300"
                      : isDisabled
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer active:scale-95"
                }
                ${isToday && !isSelected ? "ring-2 ring-blue-400 ring-offset-1" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full ring-2 ring-blue-400 bg-white" />
          <span>Hoy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <span>No disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300" />
          <span>Agenda llena</span>
        </div>
      </div>
    </div>
  );
}
