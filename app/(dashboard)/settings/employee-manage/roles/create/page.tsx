"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createRole,
  updateRole,
  Role,
} from "@/app/services/roles/roles.service";
import { useError } from "@/app/providers/ErrorProvider";

interface CreateRoleFormProps {
  mode: "create" | "edit";
  roleData?: Role | null;
  onClose: () => void;
}

const initialForm = {
  name: "",
  description: "",
};

export default function CreateRoleForm({
  mode,
  roleData,
  onClose,
}: CreateRoleFormProps) {
  const { showSuccess, showError } = useError();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && roleData) {
      setForm({
        name: roleData.name || "",
        description: roleData.description || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [mode, roleData]);

  /* ---------- HANDLE CHANGE ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showError("Please enter a role name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && roleData?.id) {
        await updateRole(roleData.id, form);
        showSuccess("Role updated successfully");
      } else {
        await createRole(form);
        showSuccess("Role created successfully");
      }
      onClose();
    } catch (error) {
      // Error is handled by global error handler
      console.error("Failed to save role:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit Role" : "Create Role"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Sales Manager"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of this role"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {mode === "create" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Note:</span> After creating the
                role, you can manage permissions by clicking View Permissions
                from the roles list.
              </p>
            </div>
          )}
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
            ? "Update Role"
            : "Create Role"}
        </Button>
      </div>
    </div>
  );
}
