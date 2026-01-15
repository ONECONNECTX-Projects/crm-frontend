"use client";

import { useRef } from "react";

interface DateInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  error?: string;
  disabled?: boolean;
}

export default function DateInput({
  label,
  value,
  onChange,
  min,
  max,
  error,
  disabled = false,
}: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openCalendar = () => {
    // Chrome / Edge support
    if (inputRef.current?.showPicker) {
      inputRef.current.showPicker();
    } else {
      // Fallback for other browsers
      inputRef.current?.focus();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
      )}

      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onClick={openCalendar}
        onFocus={openCalendar}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 cursor-pointer ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
