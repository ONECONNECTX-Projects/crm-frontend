"use client";

import { useEffect, useState } from "react";

interface PriorityFormData {
  id?: number;
  name: string;
  color: string;
}

interface CreatePriorityFormProps {
  mode?: "create" | "edit";
  initialData?: PriorityFormData | null;
  onClose?: () => void;
  onSubmit?: (data: PriorityFormData) => void;
}

export default function CreatePriorityForm({
  mode = "create",
  initialData,
  onClose,
  onSubmit,
}: CreatePriorityFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#1677FF");

  // 🔹 Prefill when editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setColor(initialData.color);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit?.({
      id: initialData?.id,
      name,
      color,
    });

    onClose?.();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit priority" : "Create priority"}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Priority Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> Priority Name
          </label>
          <input
            type="text"
            placeholder="Priority name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
              focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Color Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> Color Code
          </label>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded border border-gray-300 p-1"
            />

            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {mode === "edit" ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
