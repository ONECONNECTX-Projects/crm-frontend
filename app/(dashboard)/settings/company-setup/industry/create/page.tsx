"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useError } from "@/app/providers/ErrorProvider";
import {
  createIndustry,
  Industry,
  updateIndustry,
} from "@/app/services/Industry/industry.service";

interface CreateIndustryFormProps {
  mode: "create" | "edit";
  IndustryData?: Industry | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateIndustryForm({
  mode,
  IndustryData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateIndustryFormProps) {
  const { showSuccess, showError } = useError();

  const [IndustryName, setIndustryName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && IndustryData) {
      setIndustryName(IndustryData.name || "");
    } else {
      setIndustryName("");
    }
  }, [mode, IndustryData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!IndustryName.trim()) {
      showError("Please enter a Industry name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && IndustryData?.id) {
        await updateIndustry(IndustryData.id, {
          name: IndustryName,
        });
        showSuccess("Industry updated successfully");
      } else {
        await createIndustry({
          name: IndustryName,
        });
        showSuccess("Industry created successfully");
      }

      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save Industry:", error);
      showError("Failed to save Industry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      {!popUp && (
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {mode === "edit" ? "Edit Industry" : "Create Industry"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={IndustryName}
            onChange={(e) => setIndustryName(e.target.value)}
            placeholder="Enter Industry name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            autoFocus
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t">
        {!popUp && (
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
              ? "Update Industry"
              : "Create Industry"}
        </Button>
      </div>
    </div>
  );
}
