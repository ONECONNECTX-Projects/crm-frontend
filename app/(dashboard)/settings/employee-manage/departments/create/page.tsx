"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createDepartment,
  updateDepartment,
  Department,
} from "@/app/services/department/departments.service";
import { useError } from "@/app/providers/ErrorProvider";

interface CreateDepartmentFormProps {
  mode: "create" | "edit";
  departmentData?: Department | null;
  onClose: () => void;
}

export default function CreateDepartmentForm({
  mode,
  departmentData,
  onClose,
}: CreateDepartmentFormProps) {
  const { showSuccess, showError } = useError();
  const [departmentName, setDepartmentName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && departmentData) {
      setDepartmentName(departmentData.name || "");
    } else {
      setDepartmentName("");
    }
  }, [mode, departmentData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!departmentName.trim()) {
      showError("Please enter a department name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && departmentData?.id) {
        await updateDepartment(departmentData.id, { name: departmentName });
        showSuccess("Department updated successfully");
      } else {
        await createDepartment({ name: departmentName });
        showSuccess("Department created successfully");
      }
      onClose();
    } catch (error) {
      console.error("Failed to save department:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit Department" : "Create Department"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="Enter department name"
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
            ? "Update Department"
            : "Create Department"}
        </Button>
      </div>
    </div>
  );
}
