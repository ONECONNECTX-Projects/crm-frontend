"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useError } from "@/app/providers/ErrorProvider";
import {
  createQuoteStage,
  QuoteStage,
  updateQuoteStage,
} from "@/app/services/quote-stage-setup/quote-stage-setup.service";

interface CreateQuoteStageFormProps {
  mode: "create" | "edit";
  QuoteStageData?: QuoteStage | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateQuoteStageForm({
  mode,
  QuoteStageData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateQuoteStageFormProps) {
  const { showSuccess, showError } = useError();
  const [QuoteStageName, setQuoteStageName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && QuoteStageData) {
      setQuoteStageName(QuoteStageData.name || "");
    } else {
      setQuoteStageName("");
    }
  }, [mode, QuoteStageData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!QuoteStageName.trim()) {
      showError("Please enter a Quote Stage name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && QuoteStageData?.id) {
        await updateQuoteStage(QuoteStageData.id, { name: QuoteStageName });
        showSuccess("Quote Stage updated successfully");
      } else {
        await createQuoteStage({ name: QuoteStageName });
        showSuccess("Quote Stage created successfully");
      }
      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save Quote Stage:", error);
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
            {mode === "edit" ? "Edit Quote Stage" : "Create Quote Stage"}
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
            Quote Stage Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={QuoteStageName}
            onChange={(e) => setQuoteStageName(e.target.value)}
            placeholder="Enter Quote Stage name"
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
              ? "Update Quote Stage"
              : "Create Quote Stage"}
        </Button>
      </div>
    </div>
  );
}
