"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useError } from "@/app/providers/ErrorProvider";
import {
  createLeadSource,
  LeadSource,
  updateLeadSource,
} from "@/app/services/lead-source/lead-source.service";

interface CreateLeadSourceFormProps {
  mode: "create" | "edit";
  leadSourceData?: LeadSource | null;
  onClose: () => void;
}

export default function CreateLeadSourceForm({
  mode,
  leadSourceData,
  onClose,
}: CreateLeadSourceFormProps) {
  const { showSuccess, showError } = useError();
  const [leadSourceName, setLeadSourceName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && leadSourceData) {
      setLeadSourceName(leadSourceData.name || "");
    } else {
      setLeadSourceName("");
    }
  }, [mode, leadSourceData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!leadSourceName.trim()) {
      showError("Please enter a Lead Source name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && leadSourceData?.id) {
        await updateLeadSource(leadSourceData.id, { name: leadSourceName });
        showSuccess("Lead Source updated successfully");
      } else {
        await createLeadSource({ name: leadSourceName });
        showSuccess("Lead Source created successfully");
      }
      onClose();
    } catch (error) {
      console.error("Failed to save lead source:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit Lead Source" : "Create Lead Source"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lead Source Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={leadSourceName}
            onChange={(e) => setLeadSourceName(e.target.value)}
            placeholder="Enter lead source name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t">
        <Button variant="outline" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
            ? "Update Lead Source"
            : "Create Lead Source"}
        </Button>
      </div>
    </div>
  );
}
