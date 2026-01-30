"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useError } from "@/app/providers/ErrorProvider";
import {
  createLeadStatus,
  LeadStatus,
  updateLeadStatus,
} from "@/app/services/lead-status/lead-status.service";

interface CreateLeadStatusFormProps {
  mode: "create" | "edit";
  LeadStatusData?: LeadStatus | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateLeadStatusForm({
  mode,
  LeadStatusData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateLeadStatusFormProps) {
  const { showSuccess, showError } = useError();
  const [LeadStatusName, setLeadStatusName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [color, setColor] = useState("#1677FF");
  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && LeadStatusData) {
      setLeadStatusName(LeadStatusData.name || "");
      setColor(LeadStatusData.color || "#1677FF");
    } else {
      setLeadStatusName("");
    }
  }, [mode, LeadStatusData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!LeadStatusName.trim()) {
      showError("Please enter a Lead Status name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && LeadStatusData?.id) {
        await updateLeadStatus(LeadStatusData.id, {
          name: LeadStatusName,
          color: color,
        });
        showSuccess("Lead Status updated successfully");
      } else {
        await createLeadStatus({ name: LeadStatusName, color: color });
        showSuccess("Lead Status created successfully");
      }
      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save Lead Status:", error);
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
            {mode === "edit" ? "Edit Lead Status" : "Create Lead Status"}
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
            Lead Status Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={LeadStatusName}
            onChange={(e) => setLeadStatusName(e.target.value)}
            placeholder="Enter Lead Status name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
              ? "Update Lead Status"
              : "Create Lead Status"}
        </Button>
      </div>
    </div>
  );
}
