"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useError } from "@/app/providers/ErrorProvider";
import {
  ContactStage,
  createContactStage,
  updateContactStage,
} from "@/app/services/contact-stages/contact-stages.service";

interface CreateContactStageFormProps {
  mode: "create" | "edit";
  ContactStageData?: ContactStage | null;
  onClose: () => void;
}

export default function CreateContactStageForm({
  mode,
  ContactStageData,
  onClose,
}: CreateContactStageFormProps) {
  const { showSuccess, showError } = useError();

  const [ContactStageName, setContactStageName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && ContactStageData) {
      setContactStageName(ContactStageData.name || "");
    } else {
      setContactStageName("");
    }
  }, [mode, ContactStageData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!ContactStageName.trim()) {
      showError("Please enter a Contact Stage name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && ContactStageData?.id) {
        await updateContactStage(ContactStageData.id, {
          name: ContactStageName,
        });
        showSuccess("Contact Stage updated successfully");
      } else {
        await createContactStage({
          name: ContactStageName,
        });
        showSuccess("Contact Stage created successfully");
      }

      onClose();
    } catch (error) {
      console.error("Failed to save Contact Stage:", error);
      showError("Failed to save Contact Stage");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit Contact Stage" : "Create Contact Stage"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Stage Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={ContactStageName}
            onChange={(e) => setContactStageName(e.target.value)}
            placeholder="Enter Contact Stage name"
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
            ? "Update Contact Stage"
            : "Create Contact Stage"}
        </Button>
      </div>
    </div>
  );
}
