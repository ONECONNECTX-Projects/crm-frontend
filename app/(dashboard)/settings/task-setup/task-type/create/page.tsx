"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useError } from "@/app/providers/ErrorProvider";
import {
  createTaskType,
  TaskType,
  updateTaskType,
} from "@/app/services/task-type/task-type.service";

interface CreateTaskTypeFormProps {
  mode: "create" | "edit";
  TaskTypeData?: TaskType | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateTaskTypeForm({
  mode,
  TaskTypeData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateTaskTypeFormProps) {
  const { showSuccess, showError } = useError();

  const [TaskTypeName, setTaskTypeName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && TaskTypeData) {
      setTaskTypeName(TaskTypeData.name || "");
    } else {
      setTaskTypeName("");
    }
  }, [mode, TaskTypeData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!TaskTypeName.trim()) {
      showError("Please enter a Task Type name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && TaskTypeData?.id) {
        await updateTaskType(TaskTypeData.id, {
          name: TaskTypeName,
        });
        showSuccess("Task Type updated successfully");
      } else {
        await createTaskType({
          name: TaskTypeName,
        });
        showSuccess("Task Type created successfully");
      }

      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save Task Type:", error);
      showError("Failed to save Task Type");
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
            {mode === "edit" ? "Edit Task Type" : "Create Task Type"}
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
            Task Type Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={TaskTypeName}
            onChange={(e) => setTaskTypeName(e.target.value)}
            placeholder="Enter Task Type name"
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
              ? "Update Task Type"
              : "Create Task Type"}
        </Button>
      </div>
    </div>
  );
}
