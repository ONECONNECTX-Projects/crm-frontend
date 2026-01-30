"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useError } from "@/app/providers/ErrorProvider";
import {
  createOpportunitySource,
  OpportunitySource,
  updateOpportunitySource,
} from "@/app/services/opportunity-source/opportunity-source.service";

interface CreateOpportunitySourceFormProps {
  mode: "create" | "edit";
  OpportunitySourceData?: OpportunitySource | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateOpportunitySourceForm({
  mode,
  OpportunitySourceData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateOpportunitySourceFormProps) {
  const { showSuccess, showError } = useError();
  const [OpportunitySourceName, setOpportunitySourceName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && OpportunitySourceData) {
      setOpportunitySourceName(OpportunitySourceData.name || "");
    } else {
      setOpportunitySourceName("");
    }
  }, [mode, OpportunitySourceData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!OpportunitySourceName.trim()) {
      showError("Please enter a Opportunity Source name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && OpportunitySourceData?.id) {
        await updateOpportunitySource(OpportunitySourceData.id, {
          name: OpportunitySourceName,
        });
        showSuccess("Opportunity Source updated successfully");
      } else {
        await createOpportunitySource({ name: OpportunitySourceName });
        showSuccess("Opportunity Source created successfully");
      }
      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save Opportunity Source:", error);
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
              ? "Edit OpportunitySource"
              : "Create OpportunitySource"}
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
            Opportunity Source Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={OpportunitySourceName}
            onChange={(e) => setOpportunitySourceName(e.target.value)}
            placeholder="Enter OpportunitySource name"
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
              ? "Update Opportunity Source"
              : "Create Opportunity Source"}
        </Button>
      </div>
    </div>
  );
}
