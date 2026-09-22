"use client";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "lead" | "custom";
  colorMap?: Record<string, { bg: string; text: string; border: string }>;
}

const leadStatusColors: Record<string, { bg: string; text: string; border: string }> = {
  new: {
    bg: "bg-brand-50/80",
    text: "text-brand-500",
    border: "border-brand-200",
  },
  working: {
    bg: "bg-accent-brand-50/80",
    text: "text-accent-brand-500",
    border: "border-accent-brand-200",
  },
  qualified: {
    bg: "bg-green-50/80",
    text: "text-green-700",
    border: "border-green-200",
  },
  lost: {
    bg: "bg-red-50/80",
    text: "text-red-700",
    border: "border-red-200",
  },
  converted: {
    bg: "bg-brand-100/80",
    text: "text-brand-600",
    border: "border-brand-300",
  },
};

const defaultStatusColors: Record<string, { bg: string; text: string; border: string }> = {
  active: {
    bg: "bg-green-50/80",
    text: "text-green-700",
    border: "border-green-200",
  },
  inactive: {
    bg: "bg-white/60",
    text: "text-foreground",
    border: "border-border",
  },
  pending: {
    bg: "bg-accent-brand-50/80",
    text: "text-accent-brand-500",
    border: "border-accent-brand-200",
  },
  completed: {
    bg: "bg-brand-50/80",
    text: "text-brand-500",
    border: "border-brand-200",
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
    bg: "bg-white/60",
    text: "text-foreground",
    border: "border-border",
  };

  const finalColors = colors || fallbackColors;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm ${finalColors.bg} ${finalColors.text} ${finalColors.border}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}