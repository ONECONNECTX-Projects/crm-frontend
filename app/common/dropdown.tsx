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
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
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
        className={`w-full px-3 py-2.5 text-sm glass-input rounded-lg text-foreground outline-none transition-[color,box-shadow,border-color] ${
          hasError
            ? "!border-destructive focus-visible:ring-[3px] focus-visible:ring-destructive/25"
            : "focus-visible:border-brand-400 focus-visible:ring-[3px] focus-visible:ring-brand-500/20"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""} ${className}`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hasError && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default SelectDropdown;
