"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createDesignation,
  updateDesignation,
  Designation,
} from "@/app/services/designation/designation.service";
import { useError } from "@/app/providers/ErrorProvider";

interface CreateDesignationFormProps {
  mode: "create" | "edit";
  designationData?: Designation | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateDesignationForm({
  mode,
  designationData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateDesignationFormProps) {
  const { showSuccess, showError } = useError();

  const [designationName, setDesignationName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && designationData) {
      setDesignationName(designationData.name || "");
    } else {
      setDesignationName("");
    }
  }, [mode, designationData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!designationName.trim()) {
      showError("Please enter a designation name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && designationData?.id) {
        await updateDesignation(designationData.id, {
          name: designationName,
        });
        showSuccess("Designation updated successfully");
      } else {
        await createDesignation({
          name: designationName,
        });
        showSuccess("Designation created successfully");
      }

      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save designation:", error);
      showError("Failed to save designation");
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
            {mode === "edit" ? "Edit Designation" : "Create Designation"}
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
            Designation Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={designationName}
            onChange={(e) => setDesignationName(e.target.value)}
            placeholder="Enter designation name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            autoFocus
          />
        </div>

        {/* {mode === "create" && (
          <div className="border-t pt-6 space-y-4">
            <div className="bg-brand-50 border border-brand-200 rounded-md p-4">
              <p className="text-sm text-brand-600">
                <strong>Bulk Upload:</strong> Upload multiple designations using
                a CSV file.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <Button variant="outline" className="w-full">
              Download Sample CSV
            </Button>
          </div>
        )} */}
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
              ? "Update Designation"
              : "Create Designation"}
        </Button>
      </div>
    </div>
  );
}
