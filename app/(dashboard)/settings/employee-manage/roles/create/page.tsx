"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CreateRoleFormProps {
  mode: "create" | "edit";
  roleId?: number | null;
  onClose: () => void;
}

const initialForm = {
  name: "",
  description: "",
};

export default function CreateRoleForm({
  mode,
  roleId,
  onClose,
}: CreateRoleFormProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && roleId) {
      setLoading(true);
      fetch(`/api/roles/${roleId}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({ name: data.name || "", description: data.description || "" });
        })
        .finally(() => setLoading(false));
    }
  }, [mode, roleId]);

  /* ---------- HANDLE CHANGE ---------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Please enter a role name");
      return;
    }

    const url = mode === "edit" ? `/api/roles/${roleId}` : "/api/roles";
    const method = mode === "edit" ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    onClose();
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
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
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
                  <span className="font-medium">Note:</span> After creating the role, you can manage permissions by clicking "View Permissions" from the roles list.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {mode === "edit" ? "Update Role" : "Create Role"}
        </Button>
      </div>
    </div>
  );
}