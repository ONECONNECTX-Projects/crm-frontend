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
      className={`w-full flex items-center justify-center bg-brand-500 text-white p-3 rounded-lg hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all ${className}`}
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        label
      )}
    </button>
  );
}
