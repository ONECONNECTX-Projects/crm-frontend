import { Plus } from "lucide-react";
import React from "react";

interface Option {
  label: string;
  value: string | number;
}

interface SelectDropdownProps {
  label?: string;
  value?: string | number;
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  onAddClick?: () => void;
  disabled?: boolean;
  required?: boolean; // New prop for red asterisk
  error?: string; // New prop for error styling
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  value,
  options,
  placeholder = "Select option",
  onChange,
  className = "",
  disabled = false,
  onAddClick,
  required = false,
  error,
}) => {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center mb-1">
          <label className="text-sm sm:text-base font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {onAddClick && (
            <button
              type="button"
              onClick={onAddClick}
              className="ml-2 p-1 rounded hover:bg-brand-50"
              title={`Add ${label}`}
            >
              <Plus className="w-4 h-4 text-brand-500" />
            </button>
          )}
        </div>
      )}

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full p-2.5 sm:p-3 text-sm sm:text-base border rounded-lg text-gray-700 focus:outline-none focus:ring-2 transition-all ${
          hasError
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-brand-500"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"} ${className}`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hasError && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectDropdown;
