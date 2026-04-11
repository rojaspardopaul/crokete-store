"use client";

import { useState } from "react";
import { notifyError, notifySuccess } from "@utils/toast";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  // Honeypot field — invisible to humans, filled only by bots
  const [honeypot, setHoneypot] = useState("");

  const handleChange = (e) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Bot check: honeypot must be empty
    if (honeypot) return;

    const { name, email, subject, message } = fields;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      return notifyError("Por favor completa todos los campos.");
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return notifyError(data?.message || "Error al enviar el mensaje.");
      }

      notifySuccess(data?.message || "Tu mensaje ha sido enviado correctamente.");
      setFields({ name: "", email: "", subject: "", message: "" });
    } catch {
      notifyError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "px-4 py-3 flex items-center w-full rounded appearance-none opacity-75 transition duration-300 ease-in-out text-sm focus:ring-0 bg-white border border-gray-300 focus:shadow-none focus:outline-none focus:border-gray-500 placeholder-body";

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto flex flex-col justify-center">
      {/* Honeypot anti-spam — hidden from real users, bots fill it automatically */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none", tabIndex: -1 }}>
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
          <div className="w-full md:w-1/2">
            <input
              name="name"
              type="text"
              value={fields.name}
              onChange={handleChange}
              placeholder="Ingresa tu Nombre"
              className={inputClass}
              disabled={loading}
            />
          </div>
          <div className="w-full md:w-1/2 md:ml-2.5 lg:ml-5 mt-2 md:mt-0">
            <input
              name="email"
              type="email"
              value={fields.email}
              onChange={handleChange}
              placeholder="Ingresa tu Correo"
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>
        <div className="relative">
          <input
            name="subject"
            type="text"
            value={fields.subject}
            onChange={handleChange}
            placeholder="Ingresa tu Asunto"
            className={inputClass}
            disabled={loading}
          />
        </div>
        <div className="relative mb-4">
          <textarea
            name="message"
            value={fields.message}
            onChange={handleChange}
            className={inputClass}
            autoComplete="off"
            spellCheck="false"
            rows="4"
            placeholder="Escribe tu Mensaje"
            disabled={loading}
          />
        </div>
        <div className="relative">
          <button
            type="submit"
            disabled={loading}
            className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-kachabazar-500 text-white px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 hover:text-white hover:bg-kachabazar-600 h-12 mt-1 text-sm lg:text-base w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
