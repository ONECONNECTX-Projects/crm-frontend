"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useError } from "@/app/providers/ErrorProvider";
import {
  createTaskStatus,
  TaskStatus,
  updateTaskStatus,
} from "@/app/services/task-status/task-status.service";

interface CreateTaskStatusFormProps {
  mode: "create" | "edit";
  TaskStatusData?: TaskStatus | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateTaskStatusForm({
  mode,
  TaskStatusData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateTaskStatusFormProps) {
  const { showSuccess, showError } = useError();

  const [TaskStatusName, setTaskStatusName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && TaskStatusData) {
      setTaskStatusName(TaskStatusData.name || "");
    } else {
      setTaskStatusName("");
    }
  }, [mode, TaskStatusData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!TaskStatusName.trim()) {
      showError("Please enter a Task Status name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && TaskStatusData?.id) {
        await updateTaskStatus(TaskStatusData.id, {
          name: TaskStatusName,
        });
        showSuccess("Task Status updated successfully");
      } else {
        await createTaskStatus({
          name: TaskStatusName,
        });
        showSuccess("Task Status created successfully");
      }

      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save Task Status:", error);
      showError("Failed to save Task Status");
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
            {mode === "edit" ? "Edit Task Status" : "Create Task Status"}
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
            Task Status Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={TaskStatusName}
            onChange={(e) => setTaskStatusName(e.target.value)}
            placeholder="Enter Task Status name"
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
              ? "Update Task Status"
              : "Create Task Status"}
        </Button>
      </div>
    </div>
  );
}
