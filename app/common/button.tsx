"use client";

interface CommonButtonProps {
  label: string;
  type?: "button" | "submit";
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function CommonButton({
  label,
  type = "button",
  isLoading = false,
  onClick,
  className = "",
}: CommonButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`flex w-full items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 p-3 text-white shadow-lg shadow-brand-500/30 ring-1 ring-white/25 transition-shadow hover:shadow-xl hover:shadow-brand-500/40 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        label
      )}
    </button>
  );
}
