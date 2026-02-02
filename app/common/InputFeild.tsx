/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputFieldProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: any;
  onChange: (value: string) => void;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  error?: string;
  icon?: React.ReactNode;
  noLeadingSpace?: boolean;
  disabled?: boolean;
  required?: boolean; // New prop
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
  disabled = false,
  required = false, // Default to false
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const isPassword = type === "password";

  const handleKeyDown = (e: any) => {
    if (noLeadingSpace && value === "" && e.key === " ") {
      e.preventDefault();
      setLocalError("Cannot start with space");
    }
  };

  const validateValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let val = e.target.value;
    if (noLeadingSpace && val.startsWith(" ")) {
      setLocalError("Cannot start with space");
      val = val.trimStart();
    } else {
      setLocalError("");
    }
    onChange(val);
  };

  // Combine local validation and parent errors
  const hasError = !!(localError || error);

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {icon}
          </div>
        )}

        {multiline ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={validateValue}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            rows={rows}
            disabled={disabled}
            className={`w-full p-2.5 sm:p-3 text-sm sm:text-base
              ${icon ? "pl-11 sm:pl-12" : ""}
              border rounded-lg text-gray-700
              focus:outline-none focus:ring-2 transition-all
              ${
                hasError
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-brand-500"
              }
              ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            `}
          />
        ) : (
          <>
            <input
              type={isPassword && showPassword ? "text" : type}
              placeholder={placeholder}
              value={value}
              onChange={validateValue}
              onKeyDown={handleKeyDown}
              maxLength={maxLength}
              disabled={disabled}
              className={`w-full p-2.5 sm:p-3 text-sm sm:text-base
                ${icon ? "pl-11 sm:pl-12" : ""}
                pr-10 sm:pr-12
                border rounded-lg text-gray-700
                focus:outline-none focus:ring-2 transition-all
                ${
                  hasError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-brand-500"
                }
                ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
              `}
            />

            {isPassword && (
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
              >
                {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </span>
            )}
          </>
        )}
      </div>

      {hasError && (
        <p className="text-red-500 text-xs sm:text-sm mt-1">
          {localError || error}
        </p>
      )}
    </div>
  );
}
