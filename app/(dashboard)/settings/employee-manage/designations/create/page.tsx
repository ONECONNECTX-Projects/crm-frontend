"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CreateDesignationFormProps {
  mode: "create" | "edit";
  designationId?: number | null;
  onClose: () => void;
}

const initialForm = {
  name: "",
};

export default function CreateDesignationForm({
  mode,
  designationId,
  onClose,
}: CreateDesignationFormProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  /* ---------- HANDLE CHANGE ---------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit Designation" : "Create Designation"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <>
            {/* Designation Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Manager, Sales Man"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* CSV Upload – ONLY CREATE MODE */}
            {mode === "create" && (
              <div className="border-t pt-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Bulk Upload:</strong> Upload multiple designations
                    using a CSV file.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) =>
                      setFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {file && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                <Button variant="outline" className="w-full">
                  Download Sample CSV
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button>
          {mode === "edit" ? "Update Designation" : "Create Designation"}
        </Button>
      </div>
    </div>
  );
}
