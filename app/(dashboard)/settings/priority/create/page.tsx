"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useError } from "@/app/providers/ErrorProvider";
import {
  createPriority,
  Priority,
  updatePriority,
} from "@/app/services/priority/priority.service";

interface CreatePriorityFormProps {
  mode: "create" | "edit";
  PriorityData?: Priority | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreatePriorityForm({
  mode,
  PriorityData,
  onClose,
  onSuccess,
  popUp = false,
}: CreatePriorityFormProps) {
  const { showSuccess, showError } = useError();
  const [PriorityName, setPriorityName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [color, setColor] = useState("#1677FF");
  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && PriorityData) {
      setPriorityName(PriorityData.name || "");
      setColor(PriorityData.color || "#1677FF");
    } else {
      setPriorityName("");
    }
  }, [mode, PriorityData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!PriorityName.trim()) {
      showError("Please enter a Priority name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && PriorityData?.id) {
        await updatePriority(PriorityData.id, {
          name: PriorityName,
          color: color,
        });
        showSuccess("Priority updated successfully");
      } else {
        await createPriority({ name: PriorityName, color: color });
        showSuccess("Priority created successfully");
      }
      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save Priority:", error);
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
            {mode === "edit" ? "Edit Priority" : "Create Priority"}
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
            Priority Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={PriorityName}
            onChange={(e) => setPriorityName(e.target.value)}
            placeholder="Enter Priority name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> Color Code
          </label>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded border border-gray-300 p-1"
            />

            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
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
              ? "Update Priority"
              : "Create Priority"}
        </Button>
      </div>
    </div>
  );
}
