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
        <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      )}

      <input
        type="date"
        value={value || ""} // safe fallback
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value ? e.target.value : null)}
        className={`glass-input w-full rounded-lg px-3 py-2.5 text-sm text-foreground outline-none transition-[color,box-shadow,border-color] ${
          error
            ? "!border-destructive focus-visible:ring-[3px] focus-visible:ring-destructive/25"
            : "focus-visible:border-brand-400 focus-visible:ring-[3px] focus-visible:ring-brand-500/20"
        }`}
      />

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
