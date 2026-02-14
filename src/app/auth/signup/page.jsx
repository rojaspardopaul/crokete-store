"use client";

import Link from "next/link";
import { FiLock, FiMail, FiUser, FiPhone } from "react-icons/fi";
import { useActionState, useEffect } from "react";

//internal import
import Error from "@components/form/Error";
import { notifyError, notifySuccess } from "@utils/toast";
import ErrorTwo from "@components/form/ErrorTwo";
import ShowToast from "@components/common/ShowToast";
import SubmitButton from "@components/form/SubmitButton";
import InputAreaTwo from "@components/form/InputAreaTwo";
import BottomNavigation from "@components/login/BottomNavigation";
import { verifyEmailAddress } from "@services/ServerActionServices";

const SignUp = () => {
  const [state, formAction] = useActionState(verifyEmailAddress, undefined);

  useEffect(() => {
    // console.log("state error 1st", state);
    if (state?.error) {
      // console.log("state error", state);
      notifyError(state?.error);
    }
    if (state?.user) {
      notifySuccess("¡Revisa tu correo electrónico para verificar tu cuenta!");
    }
  });

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="py-4 flex flex-col lg:flex-row w-full">
          <div className="w-full sm:p-5 lg:p-8">
            <div className="mx-auto text-left justify-center rounded-md w-full max-w-lg px-4 py-8 sm:p-10 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2x">
              <div className="overflow-hidden mx-auto">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-1">
                    Bienvenido a Kachabazar
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 mb-6">
                    Crea tu cuenta, es gratis.
                  </p>
                </div>
                <form
                  action={formAction}
                  className="flex flex-col justify-center"
                >
                  <div className="grid grid-cols-1 gap-5">
                    <div className="form-group">
                      <InputAreaTwo
                        label="Nombre"
                        name="name"
                        type="text"
                        placeholder="Nombre Completo"
                        Icon={FiUser}
                        defaultValue={state?.values?.name || ""}
                      />

                      <Error errorName={state?.errors?.name?.join(" ")} />
                    </div>

                    <div className="form-group">
                      <InputAreaTwo
                        label="Correo"
                        name="email"
                        type="email"
                        placeholder="Correo"
                        Icon={FiMail}
                        defaultValue={state?.values?.email || ""}
                      />
                      <Error errorName={state?.errors?.email?.join(" ")} />
                    </div>

                    <div className="form-group">
                      <InputAreaTwo
                        label="Teléfono"
                        name="phone"
                        type="tel"
                        placeholder="Teléfono (ej. 1234567890)"
                        Icon={FiPhone}
                        defaultValue={state?.values?.phone || ""}
                      />
                      <Error errorName={state?.errors?.phone?.join(" ")} />
                    </div>

                    <div className="form-group">
                      <InputAreaTwo
                        label="Contraseña"
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        Icon={FiLock}
                      />

                      {state?.errors?.password && (
                        <ErrorTwo errors={state?.errors?.password} />
                      )}
                    </div>

                    <div className="form-group">
                      <InputAreaTwo
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirmar Contraseña"
                        Icon={FiLock}
                      />
                      <Error errorName={state?.errors?.confirmPassword?.join(" ")} />
                    </div>

                    <SubmitButton title={"Registrarse"} />
                  </div>
                </form>
                <BottomNavigation
                  desc
                  route={"/auth/login"}
                  pageName={"Iniciar sesión"}
                  loginTitle="Regístrate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
