"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  PawPrint,
  User,
  Calendar,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  AlertCircle,
  Video,
  Sparkles,
} from "lucide-react";
import useVet from "@hooks/useVet";
import VetCalendar from "./VetCalendar";
import VetTimeSlots from "./VetTimeSlots";

const STEPS = [
  { id: 1, label: "Mascota", icon: PawPrint },
  { id: 2, label: "Veterinario", icon: User },
  { id: 3, label: "Fecha y Hora", icon: Calendar },
  { id: 4, label: "Detalles", icon: Clock },
  { id: 5, label: "Confirmar", icon: CheckCircle },
];

const speciesIcons = {
  perro: "🐕",
  gato: "🐈",
  otro: "🐾",
};

export default function VetBookingClient({
  config,
  veterinarians = [],
  pets: initialPets = [],
  priceInfo,
  token,
}) {
  const [step, setStep] = useState(1);
  const [pets, setPets] = useState(initialPets);

  // Form state
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [symptomInput, setSymptomInput] = useState("");

  // Slots & loading
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // New pet mini-form
  const [showNewPet, setShowNewPet] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    species: "perro",
    breed: "",
    age: "",
    weight: "",
    gender: "macho",
  });

  // Available dates for the calendar
  const [availableDates, setAvailableDates] = useState(null);
  const [loadingDates, setLoadingDates] = useState(false);

  const {
    loading,
    error,
    initToken,
    createPet,
    getAvailableSlots,
    getAvailableDates,
    getPriceInfo,
    requestAppointment,
  } = useVet();

  useEffect(() => {
    if (token) initToken(token);
  }, [token, initToken]);

  // Auto-select if only one pet
  useEffect(() => {
    if (pets.length === 1 && !selectedPet) {
      setSelectedPet(pets[0]);
    }
  }, [pets, selectedPet]);

  // Auto-select if only one veterinarian
  useEffect(() => {
    if (veterinarians.length === 1 && !selectedVet) {
      setSelectedVet(veterinarians[0]);
    }
  }, [veterinarians, selectedVet]);

  // Set default duration
  useEffect(() => {
    if (config?.durations?.length > 0 && !selectedDuration) {
      setSelectedDuration(config.durations[0]);
    }
  }, [config, selectedDuration]);

  // Fetch slots when vet + date + duration selected
  useEffect(() => {
    if (!selectedVet || !selectedDate || !selectedDuration) return;
    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSelectedSlot(null);
      const result = await getAvailableSlots(
        selectedVet._id,
        selectedDate,
        selectedDuration.minutes
      );
      if (result.success) {
        setAvailableSlots(result.data?.slots || []);
      }
      setSlotsLoading(false);
    };
    fetchSlots();
  }, [selectedVet, selectedDate, selectedDuration, getAvailableSlots]);

  // Fetch available dates for the current calendar month
  const fetchAvailableDates = useCallback(
    async (month) => {
      if (!selectedVet || !selectedDuration) return;
      setLoadingDates(true);
      const result = await getAvailableDates(
        selectedVet._id,
        month,
        selectedDuration.minutes
      );
      if (result.success) {
        setAvailableDates(result.data?.dates || []);
      }
      setLoadingDates(false);
    },
    [selectedVet, selectedDuration, getAvailableDates]
  );

  // Trigger initial available dates fetch when step 3 is entered
  useEffect(() => {
    if (step === 3 && selectedVet && selectedDuration) {
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      fetchAvailableDates(month);
    }
  }, [step, selectedVet, selectedDuration, fetchAvailableDates]);

  // Calculate price
  const priceCalc = useMemo(() => {
    if (!selectedDuration || !priceInfo) return null;
    const originalPrice = selectedDuration.price;
    const discountPercent = priceInfo.discountPercent || 0;
    const finalPrice = originalPrice * (1 - discountPercent / 100);
    return { originalPrice, discountPercent, finalPrice };
  }, [selectedDuration, priceInfo]);

  // Min date = today + minBookingHoursAhead
  const minDate = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + (config?.minBookingHoursAhead || 2));
    return d.toISOString().split("T")[0];
  }, [config]);

  // Max date = today + advanceBookingDays
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + (config?.advanceBookingDays || 30));
    return d.toISOString().split("T")[0];
  }, [config]);

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedPet;
      case 2:
        return !!selectedVet;
      case 3:
        return !!selectedSlot && !!selectedDuration;
      case 4:
        return reason.trim().length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleAddNewPet = async () => {
    if (!newPet.name.trim()) return;
    const result = await createPet({
      ...newPet,
      age: newPet.age ? Number(newPet.age) : undefined,
      weight: newPet.weight ? Number(newPet.weight) : undefined,
    });
    if (result.success) {
      const pet = result.data?.pet || result.data;
      setPets((prev) => [...prev, pet]);
      setSelectedPet(pet);
      setShowNewPet(false);
      setNewPet({
        name: "",
        species: "perro",
        breed: "",
        age: "",
        weight: "",
        gender: "macho",
      });
    }
  };

  const handleAddSymptom = () => {
    if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
      setSymptoms([...symptoms, symptomInput.trim()]);
      setSymptomInput("");
    }
  };

  const handleSubmit = async () => {
    const appointmentData = {
      customerPetId: selectedPet._id,
      veterinarianId: selectedVet._id,
      date: selectedSlot,
      duration: selectedDuration.minutes,
      reason,
      symptoms: symptoms.length > 0 ? symptoms : undefined,
    };

    const result = await requestAppointment(appointmentData);
    if (result.success) {
      setSubmitted(true);
      setSubmittedData(result.data);
    }
  };

  // ==========================================
  // SUCCESS SCREEN
  // ==========================================
  if (submitted) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          ¡Consulta Solicitada!
        </h2>
        <p className="text-gray-500 mb-6">
          Tu solicitud ha sido enviada. Recibirás una notificación cuando sea
          aprobada por el veterinario.
        </p>
        <div className="bg-gray-50 rounded-xl p-5 text-left text-sm space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Mascota:</span>
            <span className="font-medium">{selectedPet?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Veterinario:</span>
            <span className="font-medium">{selectedVet?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fecha:</span>
            <span className="font-medium">
              {new Date(selectedSlot).toLocaleDateString("es-MX", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Duración:</span>
            <span className="font-medium">
              {selectedDuration?.minutes} min
            </span>
          </div>
          {priceCalc && (
            <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
              <span>Precio:</span>
              <span>
                {priceCalc.finalPrice === 0
                  ? "GRATIS 🎉"
                  : `$${priceCalc.finalPrice.toFixed(2)} MXN`}
              </span>
            </div>
          )}
        </div>
        <a
          href="/user/vet-consultations"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Ver Mis Consultas
        </a>
      </div>
    );
  }

  // ==========================================
  // STEP WIZARD
  // ==========================================
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Agendar Consulta Veterinaria
      </h2>

      {/* Step Indicator */}
      <div className="flex items-center mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                step === s.id
                  ? "bg-blue-600 text-white"
                  : step > s.id
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <s.icon className="w-4 h-4" />
              <span className="hidden sm:inline whitespace-nowrap">
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  step > s.id ? "bg-emerald-300" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ==========================================
          STEP 1: Select Pet
          ========================================== */}
      {step === 1 && (
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-4">
            ¿Para cuál mascota es la consulta?
          </h3>

          {pets.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {pets.map((pet) => (
                <button
                  key={pet._id}
                  onClick={() => setSelectedPet(pet)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    selectedPet?._id === pet._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">
                    {speciesIcons[pet.species] || "🐾"}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{pet.name}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {pet.species}
                      {pet.breed ? ` · ${pet.breed}` : ""}
                    </p>
                  </div>
                  {selectedPet?._id === pet._id && (
                    <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Add new pet inline */}
          {!showNewPet ? (
            <button
              onClick={() => setShowNewPet(true)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Agregar nueva mascota
            </button>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={newPet.name}
                    onChange={(e) =>
                      setNewPet({ ...newPet, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Especie
                  </label>
                  <select
                    value={newPet.species}
                    onChange={(e) =>
                      setNewPet({ ...newPet, species: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="perro">🐕 Perro</option>
                    <option value="gato">🐈 Gato</option>
                    <option value="otro">🐾 Otro</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newPet.breed}
                  onChange={(e) =>
                    setNewPet({ ...newPet, breed: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Raza"
                />
                <input
                  type="number"
                  value={newPet.age}
                  onChange={(e) =>
                    setNewPet({ ...newPet, age: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Edad (meses)"
                  min="0"
                />
                <input
                  type="number"
                  step="0.1"
                  value={newPet.weight}
                  onChange={(e) =>
                    setNewPet({ ...newPet, weight: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Peso (kg)"
                  min="0"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewPet(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddNewPet}
                  disabled={loading || !newPet.name.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Agregar Mascota"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          STEP 2: Select Veterinarian
          ========================================== */}
      {step === 2 && (
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-4">
            Selecciona un veterinario
          </h3>

          <div className="space-y-3">
            {veterinarians.map((vet) => (
              <button
                key={vet._id}
                onClick={() => setSelectedVet(vet)}
                className={`flex items-start gap-4 w-full p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedVet?._id === vet._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {vet.image ? (
                    <img
                      src={vet.image}
                      alt={vet.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">{vet.name}</p>
                  {vet.specialties?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {vet.specialties.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {vet.bio && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {vet.bio}
                    </p>
                  )}
                </div>
                {selectedVet?._id === vet._id && (
                  <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                )}
              </button>
            ))}

            {veterinarians.length === 0 && (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  No hay veterinarios disponibles en este momento.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          STEP 3: Select Date & Time
          ========================================== */}
      {step === 3 && (
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-4">
            Selecciona fecha, hora y duración
          </h3>

          {/* Duration selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600 block mb-2">
              Duración de la consulta
            </label>
            <div className="flex flex-wrap gap-2">
              {config?.durations?.map((dur) => (
                <button
                  key={dur.minutes}
                  onClick={() => setSelectedDuration(dur)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${
                    selectedDuration?.minutes === dur.minutes
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {dur.label || `${dur.minutes} min`} —{" "}
                  ${dur.price?.toFixed(2)}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar + Time slots: side-by-side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <VetCalendar
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setSelectedSlot(null);
              }}
              onMonthChange={fetchAvailableDates}
              minDate={minDate}
              maxDate={maxDate}
              workingDays={config?.workingDays || [1, 2, 3, 4, 5]}
              availableDates={availableDates}
              loadingDates={loadingDates}
            />

            <VetTimeSlots
              slots={availableSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              loading={slotsLoading}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      )}

      {/* ==========================================
          STEP 4: Reason & Symptoms
          ========================================== */}
      {step === 4 && (
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-4">
            Cuéntanos sobre la consulta
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Motivo de la consulta *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none h-28 resize-none"
                placeholder="Describe el motivo de la consulta (ej: mi mascota no come desde ayer, tiene una herida en la pata...)"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Síntomas (opcional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSymptom();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Ej: vómito, diarrea, fiebre..."
                />
                <button
                  type="button"
                  onClick={handleAddSymptom}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {symptoms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full"
                    >
                      {s}
                      <button
                        onClick={() =>
                          setSymptoms(symptoms.filter((_, j) => j !== i))
                        }
                        className="hover:text-yellow-900"
                      >
                        <span className="text-xs">✕</span>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Customer instructions from config */}
            {config?.customerInstructions && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Instrucciones</p>
                    <p className="whitespace-pre-line">
                      {config.customerInstructions}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          STEP 5: Confirmation
          ========================================== */}
      {step === 5 && (
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-4">
            Confirma tu consulta
          </h3>

          <div className="bg-gray-50 rounded-xl p-5 space-y-4 mb-6">
            {/* Pet */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Mascota</span>
              </div>
              <span className="text-sm font-medium text-gray-800">
                {speciesIcons[selectedPet?.species]} {selectedPet?.name}
              </span>
            </div>

            {/* Vet */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Veterinario</span>
              </div>
              <span className="text-sm font-medium text-gray-800">
                {selectedVet?.name}
              </span>
            </div>

            {/* Date & Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Fecha y hora</span>
              </div>
              <span className="text-sm font-medium text-gray-800">
                {selectedSlot &&
                  new Date(selectedSlot).toLocaleDateString("es-MX", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Duración</span>
              </div>
              <span className="text-sm font-medium text-gray-800">
                {selectedDuration?.label || `${selectedDuration?.minutes} min`}
              </span>
            </div>

            {/* Platform */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Plataforma</span>
              </div>
              <span className="text-sm font-medium text-gray-800">
                {config?.videoPlatform === "google_meet"
                  ? "Google Meet"
                  : "Jitsi Meet"}
              </span>
            </div>

            {/* Reason */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Motivo</p>
              <p className="text-sm text-gray-700">{reason}</p>
            </div>

            {symptoms.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Síntomas</p>
                <div className="flex flex-wrap gap-1">
                  {symptoms.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            {priceCalc && (
              <div className="pt-3 border-t border-gray-200">
                {priceCalc.discountPercent > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Precio original</span>
                    <span className="text-gray-400 line-through">
                      ${priceCalc.originalPrice.toFixed(2)}
                    </span>
                  </div>
                )}
                {priceCalc.discountPercent > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      Descuento cliente
                    </span>
                    <span className="text-emerald-600 font-medium">
                      -{priceCalc.discountPercent}%
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-blue-700">
                    {priceCalc.finalPrice === 0
                      ? "GRATIS 🎉"
                      : `$${priceCalc.finalPrice.toFixed(2)} MXN`}
                  </span>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mb-4">
            Al confirmar, tu solicitud será enviada al veterinario. Recibirás
            una notificación con el enlace de la videollamada una vez aprobada.
          </p>
        </div>
      )}

      {/* ==========================================
          Navigation Buttons
          ========================================== */}
      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>
        ) : (
          <a
            href="/user/vet-consultations"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </a>
        )}

        {step < 5 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Siguiente
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirmar Consulta
              </>
            )}
          </button>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
