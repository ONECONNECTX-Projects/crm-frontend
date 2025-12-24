"use client";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "lead" | "custom";
  colorMap?: Record<string, { bg: string; text: string; border: string }>;
}

const leadStatusColors: Record<string, { bg: string; text: string; border: string }> = {
  new: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  working: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  qualified: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  lost: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  converted: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
};

const defaultStatusColors: Record<string, { bg: string; text: string; border: string }> = {
  active: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  inactive: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  completed: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
};

export default function StatusBadge({
  status,
  variant = "default",
  colorMap,
}: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  let colors;
  if (colorMap) {
    colors = colorMap[normalizedStatus];
  } else if (variant === "lead") {
    colors = leadStatusColors[normalizedStatus];
  } else {
    colors = defaultStatusColors[normalizedStatus];
  }

  // Fallback colors if status not found
  const fallbackColors = {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  const finalColors = colors || fallbackColors;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${finalColors.bg} ${finalColors.text} ${finalColors.border}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}