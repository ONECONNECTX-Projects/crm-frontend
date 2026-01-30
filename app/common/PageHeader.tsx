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
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1"></p>
      </div>

      {showCreateButton && (
        <Button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600"
        >
          <Plus className="w-4 h-4" />
          {createButtonText}
        </Button>
      )}
    </div>
  );
}
