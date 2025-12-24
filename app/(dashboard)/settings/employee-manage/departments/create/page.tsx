"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CreateDepartmentFormProps {
  mode: "create" | "edit";
  departmentId?: number | null;
  onClose: () => void;
}

export default function CreateDepartmentForm({
  mode,
  departmentId,
  onClose,
}: CreateDepartmentFormProps) {
  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && departmentId) {
      setLoading(true);
      fetch(`/api/departments/${departmentId}`)
        .then((res) => res.json())
        .then((data) => setDepartmentName(data.name || ""))
        .finally(() => setLoading(false));
    }
  }, [mode, departmentId]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!departmentName.trim()) {
      alert("Please enter a department name");
      return;
    }

    const url =
      mode === "edit"
        ? `/api/departments/${departmentId}`
        : "/api/departments";
    const method = mode === "edit" ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: departmentName }),
    });

    onClose();
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
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
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
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {mode === "edit" ? "Update Department" : "Create Department"}
        </Button>
      </div>
    </div>
  );
}