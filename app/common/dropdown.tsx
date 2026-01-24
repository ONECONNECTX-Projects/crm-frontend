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
}) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center  mb-1">
          <label className="font-medium text-gray-700">{label}</label>

          {onAddClick && (
            <button
              type="button"
              onClick={onAddClick}
              className="ml-2 p-2 rounded  hover:bg-blue-100"
              title={`Add ${label}`}
            >
              <Plus className="w-4 h-4 text-blue-600" />
            </button>
          )}
        </div>
      )}

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        } ${className}`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectDropdown;
