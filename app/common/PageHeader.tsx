"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  createButtonText?: string;
  onCreateClick?: () => void;
  showCreateButton?: boolean;
}

export default function PageHeader({
  title,
  createButtonText = "Create",
  onCreateClick,
  showCreateButton = true,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1"></p>
      </div>

      {showCreateButton && (
        <Button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span className="whitespace-nowrap">{createButtonText}</span>
        </Button>
      )}
    </div>
  );
}
