"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useError } from "@/app/providers/ErrorProvider";
import {
  createProjectStatus,
  ProjectStatus,
  updateProjectStatus,
} from "@/app/services/project-status/project-status";

interface CreateProjectStatusFormProps {
  mode: "create" | "edit";
  ProjectStatusData?: ProjectStatus | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateProjectStatusForm({
  mode,
  ProjectStatusData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateProjectStatusFormProps) {
  const { showSuccess, showError } = useError();
  const [ProjectStatusName, setProjectStatusName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && ProjectStatusData) {
      setProjectStatusName(ProjectStatusData.name || "");
    } else {
      setProjectStatusName("");
    }
  }, [mode, ProjectStatusData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!ProjectStatusName.trim()) {
      showError("Please enter a Project Status name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && ProjectStatusData?.id) {
        await updateProjectStatus(ProjectStatusData.id, {
          name: ProjectStatusName,
        });
        showSuccess("Project Status updated successfully");
      } else {
        await createProjectStatus({ name: ProjectStatusName });
        showSuccess("Project Status created successfully");
      }
      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save Project Status:", error);
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
            {mode === "edit" ? "Edit Project Status" : "Create Project Status"}
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
            Project Status Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={ProjectStatusName}
            onChange={(e) => setProjectStatusName(e.target.value)}
            placeholder="Enter Project Status name"
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
              ? "Update Project Status"
              : "Create Project Status"}
        </Button>
      </div>
    </div>
  );
}
