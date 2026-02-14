"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

//internal import
import { registerCustomer } from "@services/CustomerServices";
import { notifySuccess, notifyError } from "@utils/toast";

const EmailVerification = () => {
  const router = useRouter();
  const params = useParams();
  const token = params.token;
  
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setMessage("Token de verificación no válido");
        setVerificationStatus("error");
        setLoading(false);
        return;
      }

      try {
        const { user, error } = await registerCustomer(token);
        
        if (error) {
          setMessage(error);
          setVerificationStatus("error");
          notifyError(error);
        } else {
          setMessage(user.message || "¡Correo verificado exitosamente!");
          setVerificationStatus("success");
          notifySuccess("¡Correo verificado! Redirigiendo al inicio de sesión...");
          
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        }
      } catch (err) {
        setMessage("Error al verificar el correo. Por favor, intenta de nuevo.");
        setVerificationStatus("error");
        notifyError("Error al verificar el correo");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      <div className="py-10 flex flex-col lg:flex-row w-full min-h-screen items-center justify-center">
        <div className="w-full sm:p-5 lg:p-8 max-w-lg">
          <div className="mx-auto text-center justify-center rounded-md w-full px-4 py-8 sm:p-10 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <div className="overflow-hidden mx-auto">
              {loading ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">
                    Verificando tu correo electrónico
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    Por favor espera mientras verificamos tu cuenta...
                  </p>
                </>
              ) : verificationStatus === "success" ? (
                <>
                  <div className="flex justify-center mb-4">
                    <svg
                      className="h-16 w-16 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 text-emerald-600">
                    ¡Verificación exitosa!
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 mb-6">
                    {message}
                  </p>
                  <p className="text-sm text-gray-500">
                    Serás redirigido al inicio de sesión automáticamente...
                  </p>
                  <Link
                    href="/auth/login"
                    className="mt-4 inline-block text-emerald-500 hover:text-emerald-600 font-medium"
                  >
                    O haz clic aquí para iniciar sesión ahora
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <svg
                      className="h-16 w-16 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 text-red-600">
                    Error de verificación
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 mb-6">
                    {message}
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/auth/signup"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Volver a registrarse
                    </Link>
                    <Link
                      href="/auth/login"
                      className="text-gray-600 hover:text-gray-700 font-medium"
                    >
                      Ir al inicio de sesión
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
