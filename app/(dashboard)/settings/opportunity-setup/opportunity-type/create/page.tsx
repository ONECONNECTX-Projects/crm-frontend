"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useError } from "@/app/providers/ErrorProvider";
import {
  createOpportunityType,
  OpportunityType,
  updateOpportunityType,
} from "@/app/services/opportunity-types/opportunity-types.service";

interface CreateOpportunityTypeFormProps {
  mode: "create" | "edit";
  OpportunityTypeData?: OpportunityType | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateOpportunityTypeForm({
  mode,
  OpportunityTypeData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateOpportunityTypeFormProps) {
  const { showSuccess, showError } = useError();
  const [OpportunityTypeName, setOpportunityTypeName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && OpportunityTypeData) {
      setOpportunityTypeName(OpportunityTypeData.name || "");
    } else {
      setOpportunityTypeName("");
    }
  }, [mode, OpportunityTypeData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!OpportunityTypeName.trim()) {
      showError("Please enter a Opportunity Type name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && OpportunityTypeData?.id) {
        await updateOpportunityType(OpportunityTypeData.id, {
          name: OpportunityTypeName,
        });
        showSuccess("Opportunity Type updated successfully");
      } else {
        await createOpportunityType({ name: OpportunityTypeName });
        showSuccess("Opportunity Type created successfully");
      }
      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save Opportunity Type:", error);
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
            {mode === "edit"
              ? "Edit Opportunity Type"
              : "Create Opportunity Type"}
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
            Opportunity Type Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={OpportunityTypeName}
            onChange={(e) => setOpportunityTypeName(e.target.value)}
            placeholder="Enter Opportunity Type name"
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
              ? "Update Opportunity Type"
              : "Create Opportunity Type"}
        </Button>
      </div>
    </div>
  );
}
