"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useError } from "@/app/providers/ErrorProvider";
import {
  createEmploymentStatus,
  EmploymentStatus,
  updateEmploymentStatus,
} from "@/app/services/employment-statuses/employment-statuses.service";

interface CreateEmploymentStatusFormProps {
  mode: "create" | "edit";
  employmentStatusData?: EmploymentStatus | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateEmploymentStatusForm({
  mode,
  employmentStatusData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateEmploymentStatusFormProps) {
  const { showSuccess, showError } = useError();

  const [statusName, setStatusName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && employmentStatusData) {
      setStatusName(employmentStatusData.name || "");
    } else {
      setStatusName("");
    }
  }, [mode, employmentStatusData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!statusName.trim()) {
      showError("Please enter an employment status name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && employmentStatusData?.id) {
        await updateEmploymentStatus(employmentStatusData.id, {
          name: statusName,
        });
        showSuccess("Employment status updated successfully");
      } else {
        await createEmploymentStatus({
          name: statusName,
        });
        showSuccess("Employment status created successfully");
      }

      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save employment status:", error);
      showError("Failed to save employment status");
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
              ? "Edit Employment Status"
              : "Create Employment Status"}
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
            Employment Status Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={statusName}
            onChange={(e) => setStatusName(e.target.value)}
            placeholder="e.g., Full Time, Part Time, Contract"
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
              ? "Update Employment Status"
              : "Create Employment Status"}
        </Button>
      </div>
    </div>
  );
}
