"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: any;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  error?: string;
  icon?: React.ReactNode;
  noLeadingSpace?: boolean;
}

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  maxLength,
  multiline = false,
  rows = 4,
  error,
  icon,
  noLeadingSpace = false,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const isPassword = type === "password";

  // Prevent leading space BEFORE it is typed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (noLeadingSpace && value === "" && e.key === " ") {
      e.preventDefault();
      setLocalError("Cannot start with space");
    }
  };

  // Validate leading space after input
  const validateValue = (e: any) => {
    let val = e.target.value;

    if (noLeadingSpace && val.startsWith(" ")) {
      setLocalError("Cannot start with space");
      val = val.trimStart();
      e.target.value = val;
    } else {
      setLocalError("");
    }

    onChange(e);
  };

  return (
    <div className="w-full">
      {label && <label className="block mb-1 font-medium text-gray-700">{label}</label>}

      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-gray-500">{icon}</div>}

        {/* TEXTAREA */}
        {multiline ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={validateValue}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            rows={rows}
            className={`w-full p-3 pl-10 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 ${
              localError || error
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
        ) : (
          <>
            <input
              type={isPassword && showPassword ? "text" : type}
              placeholder={placeholder}
              value={value}
              onChange={validateValue}
              onKeyDown={handleKeyDown}   // <-- BLOCK SPACE BEFORE INPUT
              maxLength={maxLength}
              className={`w-full p-3 ${icon ? "pl-10" : ""} pr-12 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 ${
                localError || error
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />

            {isPassword && (
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </span>
            )}
          </>
        )}
      </div>

      {(localError || error) && (
        <p className="text-red-500 text-sm mt-1">{localError || error}</p>
      )}
    </div>
  );
}
