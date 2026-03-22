"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  PawPrint,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import useVet from "@hooks/useVet";

// ==========================================
// Status helpers
// ==========================================
const statusConfig = {
  requested: {
    label: "Pendiente",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  approved: {
    label: "Aprobada",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  confirmed: {
    label: "Confirmada",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  in_progress: {
    label: "En Curso",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  completed: {
    label: "Completada",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  rejected: {
    label: "Rechazada",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  cancelled: {
    label: "Cancelada",
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
  },
  no_show: {
    label: "No Asistió",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
};

const speciesIcons = {
  perro: "🐕",
  gato: "🐈",
  otro: "🐾",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("es-MX", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ==========================================
// Pet Form Modal
// ==========================================
function PetFormModal({ isOpen, pet, onClose, onSave, loading }) {
  const [form, setForm] = useState({
    name: "",
    species: "perro",
    breed: "",
    age: "",
    weight: "",
    gender: "macho",
    notes: "",
  });

  useEffect(() => {
    if (pet) {
      setForm({
        name: pet.name || "",
        species: pet.species || "perro",
        breed: pet.breed || "",
        age: pet.age || "",
        weight: pet.weight || "",
        gender: pet.gender || "macho",
        notes: pet.notes || "",
      });
    } else {
      setForm({
        name: "",
        species: "perro",
        breed: "",
        age: "",
        weight: "",
        gender: "macho",
        notes: "",
      });
    }
  }, [pet, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      age: form.age ? Number(form.age) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {pet ? "Editar Mascota" : "Agregar Mascota"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Nombre *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              placeholder="Nombre de tu mascota"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Especie *
              </label>
              <select
                value={form.species}
                onChange={(e) => setForm({ ...form, species: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="perro">🐕 Perro</option>
                <option value="gato">🐈 Gato</option>
                <option value="otro">🐾 Otro</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Género
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Raza
            </label>
            <input
              type="text"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Ej: Labrador, Siamés..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Edad (meses)
              </label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Ej: 24"
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Ej: 12.5"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Notas adicionales
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none h-20 resize-none"
              placeholder="Alergias, condiciones especiales..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Guardando..." : pet ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// Main Component
// ==========================================
export default function VetConsultationsClient({
  initialPets = [],
  initialAppointments = [],
  token,
}) {
  const [activeTab, setActiveTab] = useState("appointments");
  const [pets, setPets] = useState(initialPets);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [petModalOpen, setPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [expandedAppt, setExpandedAppt] = useState(null);

  const {
    loading,
    error,
    initToken,
    createPet,
    updatePet,
    deletePet,
    cancelAppointment,
  } = useVet();

  useEffect(() => {
    if (token) initToken(token);
  }, [token, initToken]);

  const handleSavePet = async (petData) => {
    let result;
    if (editingPet) {
      result = await updatePet(editingPet._id, petData);
    } else {
      result = await createPet(petData);
    }
    if (result.success) {
      const pet = result.data?.pet || result.data;
      // Refresh pets — refetch from server would be ideal, but we update locally
      if (editingPet) {
        setPets((prev) =>
          prev.map((p) => (p._id === editingPet._id ? pet : p))
        );
      } else {
        setPets((prev) => [...prev, pet]);
      }
      setPetModalOpen(false);
      setEditingPet(null);
    }
  };

  const handleDeletePet = async (petId) => {
    if (!confirm("¿Estás seguro de eliminar esta mascota?")) return;
    const result = await deletePet(petId);
    if (result.success) {
      setPets((prev) => prev.filter((p) => p._id !== petId));
    }
  };

  const handleCancelAppointment = async (apptId) => {
    const result = await cancelAppointment(apptId, cancelReason);
    if (result.success) {
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === apptId ? { ...a, status: "cancelled" } : a
        )
      );
      setCancellingId(null);
      setCancelReason("");
    }
  };

  const tabs = [
    { id: "appointments", label: "Mis Consultas", icon: Calendar },
    { id: "pets", label: "Mis Mascotas", icon: PawPrint },
  ];

  const upcomingAppointments = appointments.filter((a) =>
    ["requested", "approved", "confirmed"].includes(a.status)
  );
  const pastAppointments = appointments.filter((a) =>
    ["completed", "rejected", "cancelled", "no_show"].includes(a.status)
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Consultas Veterinarias
        </h2>
        <a
          href="/user/vet-booking"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Consulta
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 justify-center cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ==========================================
          APPOINTMENTS TAB
          ========================================== */}
      {activeTab === "appointments" && (
        <div className="space-y-6">
          {/* Upcoming */}
          {upcomingAppointments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Próximas Consultas
              </h3>
              <div className="space-y-3">
                {upcomingAppointments.map((appt) => {
                  const sc = statusConfig[appt.status] || statusConfig.requested;
                  const isExpanded = expandedAppt === appt._id;

                  return (
                    <div
                      key={appt._id}
                      className={`bg-white border ${sc.border} rounded-xl p-4 transition-all`}
                    >
                      <div
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() =>
                          setExpandedAppt(isExpanded ? null : appt._id)
                        }
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${sc.bg} ${sc.color}`}
                            >
                              {sc.label}
                            </span>
                            <span className="text-xs text-gray-400">
                              {appt.duration} min
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-800">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(appt.date)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <PawPrint className="w-4 h-4 text-gray-400" />
                            {appt.customerPet?.name || "Mascota"} ·{" "}
                            {appt.veterinarian?.name || "Veterinario"}
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                          <div className="text-sm">
                            <span className="text-gray-500">Motivo:</span>
                            <p className="text-gray-700 mt-0.5">
                              {appt.reason}
                            </p>
                          </div>

                          {appt.symptoms?.length > 0 && (
                            <div className="text-sm">
                              <span className="text-gray-500">Síntomas:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {appt.symptoms.map((s, i) => (
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

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Precio:</span>
                            <span className="font-semibold text-gray-800">
                              {appt.finalPrice === 0
                                ? "GRATIS 🎉"
                                : `$${appt.finalPrice?.toFixed(2)} MXN`}
                              {appt.discountPercent > 0 && (
                                <span className="text-xs text-emerald-600 ml-1">
                                  (-{appt.discountPercent}%)
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Meeting URL */}
                          {appt.meetingUrl && (
                            <a
                              href={appt.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors justify-center"
                            >
                              <Video className="w-4 h-4" />
                              Unirse a la videollamada
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          {/* Cancel button */}
                          {["requested", "approved", "confirmed"].includes(
                            appt.status
                          ) && (
                            <div>
                              {cancellingId === appt._id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={cancelReason}
                                    onChange={(e) =>
                                      setCancelReason(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-16"
                                    placeholder="Motivo de cancelación (opcional)"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setCancellingId(null)}
                                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                                    >
                                      Volver
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleCancelAppointment(appt._id)
                                      }
                                      disabled={loading}
                                      className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
                                    >
                                      {loading
                                        ? "Cancelando..."
                                        : "Confirmar Cancelación"}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setCancellingId(appt._id)}
                                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                                >
                                  Cancelar Consulta
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past */}
          {pastAppointments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Historial
              </h3>
              <div className="space-y-3">
                {pastAppointments.map((appt) => {
                  const sc =
                    statusConfig[appt.status] || statusConfig.completed;

                  return (
                    <div
                      key={appt._id}
                      className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${sc.bg} ${sc.color}`}
                            >
                              {sc.label}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(appt.date)} · {appt.duration} min
                          </div>
                          <div className="text-sm text-gray-500">
                            {appt.customerPet?.name} ·{" "}
                            {appt.veterinarian?.name}
                          </div>
                        </div>
                        {appt.status === "completed" && (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        )}
                      </div>

                      {/* Show diagnosis/recommendations for completed */}
                      {appt.status === "completed" &&
                        (appt.diagnosis || appt.recommendations) && (
                          <div className="mt-3 pt-3 border-t border-gray-100 text-sm space-y-2">
                            {appt.diagnosis && (
                              <div>
                                <span className="text-gray-500 text-xs font-medium">
                                  Diagnóstico:
                                </span>
                                <p className="text-gray-700">
                                  {appt.diagnosis}
                                </p>
                              </div>
                            )}
                            {appt.recommendations && (
                              <div>
                                <span className="text-gray-500 text-xs font-medium">
                                  Recomendaciones:
                                </span>
                                <p className="text-gray-700">
                                  {appt.recommendations}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {appointments.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">
                No tienes consultas aún
              </h3>
              <p className="text-gray-400 mt-2 mb-4">
                Agenda una consulta veterinaria en línea para tu mascota.
              </p>
              <a
                href="/user/vet-booking"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Agendar Consulta
              </a>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          PETS TAB
          ========================================== */}
      {activeTab === "pets" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Registra tus mascotas para agendar consultas más rápido.
            </p>
            <button
              onClick={() => {
                setEditingPet(null);
                setPetModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>

          {pets.length === 0 ? (
            <div className="text-center py-16">
              <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">
                No tienes mascotas registradas
              </h3>
              <p className="text-gray-400 mt-2 mb-4">
                Agrega a tus compañeros peludos para agendar consultas.
              </p>
              <button
                onClick={() => {
                  setEditingPet(null);
                  setPetModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Agregar Mascota
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div
                  key={pet._id}
                  className="bg-white border border-gray-200 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {speciesIcons[pet.species] || "🐾"}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {pet.name}
                        </h4>
                        <p className="text-sm text-gray-500 capitalize">
                          {pet.species}
                          {pet.breed ? ` · ${pet.breed}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingPet(pet);
                          setPetModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                      >
                        <Pencil className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDeletePet(pet._id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-500">
                    {pet.age && (
                      <div>
                        <span className="text-gray-400">Edad:</span>{" "}
                        {pet.age >= 12
                          ? `${Math.floor(pet.age / 12)} año${
                              Math.floor(pet.age / 12) > 1 ? "s" : ""
                            }`
                          : `${pet.age} meses`}
                      </div>
                    )}
                    {pet.weight && (
                      <div>
                        <span className="text-gray-400">Peso:</span>{" "}
                        {pet.weight} kg
                      </div>
                    )}
                    {pet.gender && (
                      <div>
                        <span className="text-gray-400">Género:</span>{" "}
                        <span className="capitalize">{pet.gender}</span>
                      </div>
                    )}
                  </div>

                  {pet.notes && (
                    <p className="mt-2 text-xs text-gray-400 italic">
                      {pet.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pet Form Modal */}
      <PetFormModal
        isOpen={petModalOpen}
        pet={editingPet}
        onClose={() => {
          setPetModalOpen(false);
          setEditingPet(null);
        }}
        onSave={handleSavePet}
        loading={loading}
      />

      {/* Error display */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 shadow-lg">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
