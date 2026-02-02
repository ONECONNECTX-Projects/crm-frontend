"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createRole,
  updateRole,
  Role,
} from "@/app/services/roles/roles.service";
import { useError } from "@/app/providers/ErrorProvider";
import InputField from "@/app/common/InputFeild";

interface CreateRoleFormProps {
  mode: "create" | "edit";
  roleData?: Role | null;
  onClose: () => void;
}

const initialForm: Role = {
  id: 0,
  name: "",
  description: "",
  is_active: true,
};

export default function CreateRoleForm({
  mode,
  roleData,
  onClose,
}: CreateRoleFormProps) {
  const { showSuccess, showError } = useError();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && roleData) {
      setForm({
        name: roleData.name || "",
        description: roleData.description || "",
        id: roleData.id || 0,
        is_active: roleData.is_active || false,
      });
    } else {
      setForm(initialForm);
    }
  }, [mode, roleData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    const newErrors: { name?: string } = {};

    if (!form.name.trim()) {
      newErrors.name = "Role name is required";
    } else if (form.name.length < 3) {
      newErrors.name = "Role name must be at least 3 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
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
    } catch (error: any) {
      console.error("Failed to save role:", error);
      showError(error?.response?.data?.message || "Server Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b">
        <h2 className="text-base sm:text-lg font-semibold">
          {mode === "edit" ? "Edit Role" : "Create Role"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-5">
          <div>
            <InputField
              type="text"
              label="Name"
              value={form.name}
              required
              maxLength={50}
              noLeadingSpace
              placeholder="Enter Name"
              error={errors.name}
              onChange={(value) => {
                setForm((prev) => ({ ...prev, name: value }));
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
            />
          </div>

          <div>
            <InputField
              label="Description"
              noLeadingSpace
              value={form.description}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, description: value }))
              }
              maxLength={500}
              placeholder="Enter Description"
              multiline
            />
          </div>

          {mode === "create" && (
            <div className="bg-brand-50 border border-brand-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-brand-600">
                <span className="font-medium">Note:</span> After creating the
                role, you can manage permissions by clicking View Permissions
                from the roles list.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t bg-gray-50">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full sm:w-auto"
        >
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
