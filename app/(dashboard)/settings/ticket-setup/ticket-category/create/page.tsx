"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useError } from "@/app/providers/ErrorProvider";
import {
  createTicketCategory,
  TicketCategory,
  updateTicketCategory,
} from "@/app/services/ticket-category/ticket-category.service";

interface CreateTicketCategoryFormProps {
  mode: "create" | "edit";
  TicketCategoryData?: TicketCategory | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

export default function CreateTicketCategoryForm({
  mode,
  TicketCategoryData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateTicketCategoryFormProps) {
  const { showSuccess, showError } = useError();
  const [TicketCategoryName, setTicketCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && TicketCategoryData) {
      setTicketCategoryName(TicketCategoryData.name || "");
    } else {
      setTicketCategoryName("");
    }
  }, [mode, TicketCategoryData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!TicketCategoryName.trim()) {
      showError("Please enter a Ticket Category name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && TicketCategoryData?.id) {
        await updateTicketCategory(TicketCategoryData.id, {
          name: TicketCategoryName,
        });
        showSuccess("Ticket Category updated successfully");
      } else {
        await createTicketCategory({ name: TicketCategoryName });
        showSuccess("Ticket Category created successfully");
      }
      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save Ticket Category:", error);
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
            {mode === "edit" ? "Edit TicketCategory" : "Create TicketCategory"}
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
            Ticket Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={TicketCategoryName}
            onChange={(e) => setTicketCategoryName(e.target.value)}
            placeholder="Enter Ticket Category name"
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
              ? "Update Ticket Category"
              : "Create Ticket Category"}
        </Button>
      </div>
    </div>
  );
}
