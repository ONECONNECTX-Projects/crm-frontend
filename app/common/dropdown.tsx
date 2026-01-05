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
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
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
