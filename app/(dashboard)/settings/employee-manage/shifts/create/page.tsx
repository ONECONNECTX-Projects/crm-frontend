"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CreateShiftFormProps {
  mode: "create" | "edit";
  shiftId?: number | null;
  onClose: () => void;
}

const initialForm = {
  name: "",
  startTime: "",
  endTime: "",
};

export default function CreateShiftForm({
  mode,
  shiftId,
  onClose,
}: CreateShiftFormProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  useEffect(() => {
    if (mode === "edit" && shiftId) {
      setLoading(true);
      fetch(`/api/shifts/${shiftId}`)
        .then((res) => res.json())
        .then((data) => setForm({ ...initialForm, ...data }))
        .finally(() => setLoading(false));
    }
  }, [mode, shiftId]);

  /* ---------- HANDLE CHANGE ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    // Validation
    if (!form.name.trim()) {
      alert("Please enter a shift name");
      return;
    }
    if (!form.startTime) {
      alert("Please enter start time");
      return;
    }
    if (!form.endTime) {
      alert("Please enter end time");
      return;
    }

    const url = mode === "edit" ? `/api/shifts/${shiftId}` : "/api/shifts";
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
          {mode === "edit" ? "Edit Shift" : "Create Shift"}
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
                name="startTime"
                value={form.startTime}
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
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {mode === "edit" ? "Update Shift" : "Create Shift"}
        </Button>
      </div>
    </div>
  );
}