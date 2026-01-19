interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition
        ${checked ? "bg-green-600" : "bg-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition
          ${checked ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
}
