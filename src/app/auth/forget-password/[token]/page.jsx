"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiLock } from "react-icons/fi";

//internal import
import InputAreaTwo from "@components/form/InputAreaTwo";
import SubmitButton from "@components/form/SubmitButton";
import { resetPassword } from "@services/CustomerServices";
import { notifySuccess, notifyError } from "@utils/toast";

const ResetPassword = () => {
  const params = useParams();
  const router = useRouter();
  const token = params.token;

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwords.newPassword) {
      newErrors.newPassword = "La contraseña es requerida";
    } else if (passwords.newPassword.length < 8) {
      newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = "Por favor confirma tu contraseña";
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { result, error } = await resetPassword({
        token,
        newPassword: passwords.newPassword,
      });

      if (error) {
        notifyError(error);
      } else {
        notifySuccess("¡Contraseña cambiada exitosamente! Redirigiendo al login...");
        setPasswords({ newPassword: "", confirmPassword: "" });
        
        // Redirect to login after 3 seconds to ensure password is saved
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    } catch (err) {
      notifyError("Ocurrió un error. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      <div className="py-4 flex flex-col lg:flex-row w-full">
        <div className="w-full sm:p-5 lg:p-8">
          <div className="mx-auto text-left justify-center rounded-md w-full max-w-lg px-4 py-8 sm:p-10 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2x">
            <div className="overflow-hidden mx-auto">
              <div className="text-center">
                <Link href="/" className="text-3xl font-bold">
                  Restablecer Contraseña
                </Link>
                <p className="text-sm md:text-base text-gray-500 mt-1 mb-4">
                  Ingresa tu nueva contraseña
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col justify-center">
                <div className="grid grid-cols-1 gap-5">
                  <div className="form-group">
                    <InputAreaTwo
                      label="Nueva Contraseña"
                      name="newPassword"
                      type="password"
                      placeholder="Nueva Contraseña (mínimo 8 caracteres)"
                      Icon={FiLock}
                      value={passwords.newPassword}
                      onChange={handleChange}
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <InputAreaTwo
                      label="Confirmar Contraseña"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirmar Contraseña"
                      Icon={FiLock}
                      value={passwords.confirmPassword}
                      onChange={handleChange}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <SubmitButton 
                    title={loading ? "Guardando..." : "Restablecer Contraseña"} 
                    disabled={loading}
                  />

                  <div className="text-center mt-2">
                    <Link 
                      href="/auth/login" 
                      className="text-sm text-gray-600 hover:text-kachabazar-500"
                    >
                      Volver al inicio de sesión
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
