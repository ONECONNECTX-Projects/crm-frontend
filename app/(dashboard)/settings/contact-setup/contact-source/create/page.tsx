"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useError } from "@/app/providers/ErrorProvider";
import {
  ContactSource,
  createContactSource,
  updateContactSource,
} from "@/app/services/contact-source/contact-source.service";

interface CreateContactSourceFormProps {
  mode: "create" | "edit";
  ContactSourceData?: ContactSource | null;
  onClose: () => void;
}

export default function CreateContactSourceForm({
  mode,
  ContactSourceData,
  onClose,
}: CreateContactSourceFormProps) {
  const { showSuccess, showError } = useError();

  const [ContactSourceName, setContactSourceName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && ContactSourceData) {
      setContactSourceName(ContactSourceData.name || "");
    } else {
      setContactSourceName("");
    }
  }, [mode, ContactSourceData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!ContactSourceName.trim()) {
      showError("Please enter a Contact Source name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && ContactSourceData?.id) {
        await updateContactSource(ContactSourceData.id, {
          name: ContactSourceName,
        });
        showSuccess("Contact Source updated successfully");
      } else {
        await createContactSource({
          name: ContactSourceName,
        });
        showSuccess("Contact Source created successfully");
      }

      onClose();
    } catch (error) {
      console.error("Failed to save Contact Source:", error);
      showError("Failed to save Contact Source");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit Contact Source" : "Create ContactSource"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Source Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={ContactSourceName}
            onChange={(e) => setContactSourceName(e.target.value)}
            placeholder="Enter Contact Source name"
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
            ? "Update Contact Source"
            : "Create Contact Source"}
        </Button>
      </div>
    </div>
  );
}
