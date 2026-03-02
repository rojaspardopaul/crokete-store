import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Label from "@components/form/Label";
import { Input } from "@components/ui/input";

const InputAreaTwo = ({
  name,
  label,
  type,
  Icon,
  defaultValue,
  value,
  onChange,
  autocomplete,
  placeholder,
  readOnly,
}) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Label label={label} />
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-800 focus-within:text-gray-900 sm:text-base">
              <Icon />
            </span>
          </div>
        )}
        <Input
          type={isPassword && showPassword ? "text" : type}
          name={name}
          readOnly={readOnly}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autocomplete}
          className={`${
            Icon ? "py-2 pl-10" : "py-2 px-4 md:px-5"
          } w-full placeholder:text-sm text-gray-700 ${
            readOnly ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
          }${isPassword ? " pr-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
    </>
  );
};

export default InputAreaTwo;
