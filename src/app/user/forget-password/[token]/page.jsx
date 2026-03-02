"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi";

//internal import
import Error from "@components/form/Error";
import InputArea from "@components/form/InputArea";
import { UserContext } from "@context/UserContext";
import { notifyError, notifySuccess } from "@utils/toast";

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const password = useRef("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  password.current = watch("newPassword");

  const submitHandler = ({ registerEmail, password, newPassword }) => {
    // return notifySuccess("This feature is disabled for demo!");

    setLoading(true);
    // if (newPassword) {
    //   CustomerServices.resetPassword({
    //     newPassword,
    //     token: router.query?.token,
    //   })
    //     .then((res) => {
    //       setLoading(false);
    //       setShowLogin(true);
    //       notifySuccess(res.message);
    //       setValue("newPassword");
    //     })
    //     .catch((err) => {
    //       setLoading(false);
    //       notifyError(err ? err.response.data.message : err.message);
    //     });
    // }

    // if (registerEmail && password) {
    //   CustomerServices.customerLogin({
    //     registerEmail,
    //     password,
    //   })
    //     .then((res) => {
    //       setLoading(false);
    //       router.push("/");
    //       notifySuccess("Login Success!");
    //       dispatch({ type: "USER_LOGIN", payload: res });
    //       Cookies.set("_userInfo", JSON.stringify(res));
    //     })
    //     .catch((err) => {
    //       setLoading(false);
    //       notifyError(err ? err.response.data.message : err.message);
    //     });
    // }
  };

  return (
    <>
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow max-w-md w-full space-y-8 py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-serif">
              {showLogin ? "Login" : "Forget Password"}
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-2 mb-8 sm:mb-10">
              {showLogin
                ? "Login with your email and new password"
                : "Reset Your Password"}
            </p>
          </div>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col justify-center"
          >
            <div className="grid grid-cols-1 gap-5">
              {showLogin && (
                <>
                  {" "}
                  <div className="form-group">
                    <InputArea
                      register={register}
                      label="Email"
                      name="registerEmail"
                      type="email"
                      placeholder="Email"
                      Icon={FiMail}
                    />
                    <Error errorName={errors.registerEmail} />
                  </div>
                  <div className="form-group">
                    <InputArea
                      register={register}
                      label="Password"
                      name="password"
                      type="password"
                      autocomplete="new-password"
                      placeholder="Password"
                      Icon={FiLock}
                    />

                    <Error errorName={errors.password} />
                  </div>
                </>
              )}

              {!showLogin && (
                <>
                  {" "}
                  <div className="form-group">
                    <div className="relative">
                      <input
                        name="newPassword"
                        type={showNewPw ? "text" : "password"}
                        placeholder="Nueva contraseña"
                        {...register("newPassword", {
                          required: "Debes especificar una contraseña",
                          minLength: {
                            value: 8,
                            message: "La contraseña debe tener al menos 8 caracteres",
                          },
                        })}
                        className="py-2 px-4 md:px-5 pr-10 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-gray-100 border-gray-200 focus:outline-none focus:border-kachabazar-500 h-11 md:h-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw((v) => !v)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showNewPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>

                    <Error errorName={errors.newPassword} />
                  </div>
                  <div className="form-group">
                    <div className="relative">
                      <input
                        name="confirm_password"
                        type={showConfirmPw ? "text" : "password"}
                        placeholder="Confirmar contraseña"
                        {...register("confirm_password", {
                          validate: (value) =>
                            value === password.current ||
                            "Las contraseñas no coinciden",
                        })}
                        className="py-2 px-4 md:px-5 pr-10 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-gray-100 border-gray-200 focus:outline-none focus:border-kachabazar-500 h-11 md:h-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw((v) => !v)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirmPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>

                    <Error errorName={errors.confirm_password} />
                  </div>
                </>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full text-center py-3 rounded bg-kachabazar-500 font-medium text-sm text-white hover:bg-kachabazar-600 transition-all focus:outline-none my-1"
              >
                {showLogin ? "Login" : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
