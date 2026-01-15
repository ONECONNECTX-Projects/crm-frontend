"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useError } from "@/app/providers/ErrorProvider";
import {
  CompanyType,
  createCompanyType,
  updateCompanyType,
} from "@/app/services/company-type/company-type.service";

interface CreateCompanyTypeFormProps {
  mode: "create" | "edit";
  CompanyTypeData?: CompanyType | null;
  onClose: () => void;
}

export default function CreateCompanyTypeForm({
  mode,
  CompanyTypeData,
  onClose,
}: CreateCompanyTypeFormProps) {
  const { showSuccess, showError } = useError();

  const [CompanyTypeName, setCompanyTypeName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && CompanyTypeData) {
      setCompanyTypeName(CompanyTypeData.name || "");
    } else {
      setCompanyTypeName("");
    }
  }, [mode, CompanyTypeData]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!CompanyTypeName.trim()) {
      showError("Please enter a Company Type name");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "edit" && CompanyTypeData?.id) {
        await updateCompanyType(CompanyTypeData.id, {
          name: CompanyTypeName,
        });
        showSuccess("CompanyType updated successfully");
      } else {
        await createCompanyType({
          name: CompanyTypeName,
        });
        showSuccess("Company Type created successfully");
      }

      onClose();
    } catch (error) {
      console.error("Failed to save Company Type:", error);
      showError("Failed to save Company Type");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit Company Type" : "Create Company Type"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Type Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={CompanyTypeName}
            onChange={(e) => setCompanyTypeName(e.target.value)}
            placeholder="Enter CompanyType name"
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
            ? "Update Company Type"
            : "Create Company Type"}
        </Button>
      </div>
    </div>
  );
}
