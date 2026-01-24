"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createShift,
  updateShift,
  Shift,
} from "@/app/services/shift/shifts.service";
import { useError } from "@/app/providers/ErrorProvider";

interface CreateShiftFormProps {
  mode: "create" | "edit";
  shiftData?: Shift | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
  popUp?: boolean;
}

const initialForm = {
  name: "",
  start_time: "",
  end_time: "",
};

export default function CreateShiftForm({
  mode,
  shiftData,
  onClose,
  onSuccess,
  popUp = false,
}: CreateShiftFormProps) {
  const { showSuccess, showError } = useError();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && shiftData) {
      setForm({
        name: shiftData.name || "",
        start_time: shiftData.start_time || "",
        end_time: shiftData.end_time || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [mode, shiftData]);

  /* ---------- HANDLE CHANGE ---------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    // Validation
    if (!form.name.trim()) {
      showError("Please enter a shift name");
      return;
    }
    if (!form.start_time) {
      showError("Please enter start time");
      return;
    }
    if (!form.end_time) {
      showError("Please enter end time");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && shiftData?.id) {
        await updateShift(shiftData.id, {
          name: form.name,
          start_time: form.start_time,
          end_time: form.end_time,
        });
        showSuccess("Shift updated successfully");
      } else {
        await createShift({
          name: form.name,
          start_time: form.start_time,
          end_time: form.end_time,
        });
        showSuccess("Shift created successfully");
      }
      popUp ? await onSuccess?.() : onClose();
    } catch (error) {
      console.error("Failed to save shift:", error);
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
            {mode === "edit" ? "Edit Shift" : "Create Shift"}
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
        <div className="space-y-5">
          {/* Shift Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Morning Shift"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              ? "Update Shift"
              : "Create Shift"}
        </Button>
      </div>
    </div>
  );
}
