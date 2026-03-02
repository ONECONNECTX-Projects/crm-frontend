"use client";

interface DateInputProps {
  label?: string;
  value?: string | null; // accept null safely
  onChange: (value: string | null) => void;
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
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
      )}

      <input
        type="date"
        value={value || ""} // safe fallback
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value ? e.target.value : null)}
        className={`w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-brand-500"
        }`}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
