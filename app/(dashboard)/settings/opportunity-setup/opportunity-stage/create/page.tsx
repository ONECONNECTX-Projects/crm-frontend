"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useError } from "@/app/providers/ErrorProvider";
import {
  createOpportunityStage,
  OpportunityStage,
  updateOpportunityStage,
} from "@/app/services/opportunity-stage/opportunity-stage.service";

interface CreateOpportunityStageFormProps {
  mode: "create" | "edit";
  OpportunityStageData?: OpportunityStage | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateOpportunityStageForm({
  mode,
  OpportunityStageData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateOpportunityStageFormProps) {
  const { showSuccess, showError } = useError();
  const [OpportunityStageName, setOpportunityStageName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && OpportunityStageData) {
      setOpportunityStageName(OpportunityStageData.name || "");
    } else {
      setOpportunityStageName("");
    }
  }, [mode, OpportunityStageData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!OpportunityStageName.trim()) {
      showError("Please enter a Opportunity Stage name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && OpportunityStageData?.id) {
        await updateOpportunityStage(OpportunityStageData.id, {
          name: OpportunityStageName,
        });
        showSuccess("Opportunity Stage updated successfully");
      } else {
        await createOpportunityStage({ name: OpportunityStageName });
        showSuccess("Opportunity Stage created successfully");
      }
      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save Opportunity Stage:", error);
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
              ? "Edit OpportunityStage"
              : "Create OpportunityStage"}
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
            Opportunity Stage Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={OpportunityStageName}
            onChange={(e) => setOpportunityStageName(e.target.value)}
            placeholder="Enter Opportunity Stage name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              ? "Update Opportunity Stage"
              : "Create Opportunity Stage"}
        </Button>
      </div>
    </div>
  );
}
