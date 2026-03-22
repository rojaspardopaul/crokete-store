import React from "react";
import Label from "@components/form/Label";

const SelectOption = ({ name, label, options, onChange, value }) => {
  return (
    <>
      <Label label={label} />
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="py-2 px-4 md:px-5 w-full appearance-none border text-sm text-gray-700 rounded-md h-9 transition duration-200 focus:ring-0 ease-in-out border-gray-200 focus:outline-none focus:border-gray-300 pr-8 bg-white"
        >
          <option value="">Seleccione {label}</option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default SelectOption;
