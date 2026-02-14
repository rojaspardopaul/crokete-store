"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FiMail } from "react-icons/fi";

//internal import
import InputAreaTwo from "src/components/form/InputAreaTwo";
import SubmitButton from "@components/form/SubmitButton";
import BottomNavigation from "@components/login/BottomNavigation";
import { forgetPassword } from "@services/CustomerServices";
import { notifySuccess, notifyError } from "@utils/toast";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      notifyError("Por favor ingresa tu correo electrónico");
      return;
    }

    setLoading(true);
    try {
      const { result, error } = await forgetPassword({ email });
      
      if (error) {
        notifyError(error);
      } else {
        notifySuccess("¡Revisa tu correo electrónico para restablecer tu contraseña!");
        setEmail("");
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
                  Olvidaste tu contraseña
                </Link>
                <p className="text-sm md:text-base text-gray-500 mt-1 mb-4">
                  Ingresa tu correo electrónico para restablecer tu contraseña
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col justify-center">
                <div className="grid grid-cols-1 gap-5">
                  <div className="form-group">
                    <InputAreaTwo
                      label="Correo"
                      name="verifyEmail"
                      type="email"
                      placeholder="Correo Electrónico"
                      Icon={FiMail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <SubmitButton title={loading ? "Enviando..." : "Enviar solicitud"} />
                </div>
              </form>
              {/* <BottomNavigation
                or={true}
                route={"/auth/signup"}
                pageName={"Sign Up"}
                loginTitle="Sign Up"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
