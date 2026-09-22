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
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
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
            className={`w-full px-3 py-2.5 text-sm
              ${icon ? "pl-11 sm:pl-12" : ""}
              rounded-lg border border-border bg-background text-foreground
              outline-none transition-[color,box-shadow,border-color]
              ${
                hasError
                  ? "!border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20"
                  : "focus-visible:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-500/15"
              }
              ${disabled ? "cursor-not-allowed opacity-60" : ""}
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
              className={`w-full px-3 py-2.5 text-sm
                ${icon ? "pl-11 sm:pl-12" : ""}
                pr-10 sm:pr-12
                rounded-lg border border-border bg-background text-foreground
                outline-none transition-[color,box-shadow,border-color]
                ${
                  hasError
                    ? "!border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20"
                    : "focus-visible:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-500/15"
                }
                ${disabled ? "cursor-not-allowed opacity-60" : ""}
              `}
            />

            {isPassword && (
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
              >
                {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </span>
            )}
          </>
        )}
      </div>

      {hasError && (
        <p className="mt-1 text-xs text-destructive">
          {localError || error}
        </p>
      )}
    </div>
  );
}
