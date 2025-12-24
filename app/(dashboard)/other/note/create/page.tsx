"use client";

import { useEffect, useState } from "react";

type Mode = "create" | "edit";

interface NoteFormData {
  title: string;
  description: string;
}

interface Props {
  mode: Mode;
  initialData?: Partial<NoteFormData>;
  onSubmit: (data: NoteFormData) => void;
}

export default function NoteForm({ mode, initialData, onSubmit }: Props) {
  const [form, setForm] = useState<NoteFormData>({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="px-8 py-6 max-w-4xl"
    >
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        {mode === "create" ? "Create Note" : "Edit Note"}
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span> Title
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Note title"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Note Owner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note owner
          </label>
          <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
            <option>Select note owner name</option>
          </select>
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
            <option>Select company Name</option>
          </select>
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact
          </label>
          <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
            <option>Select contact</option>
          </select>
        </div>

        {/* Opportunity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opportunity
          </label>
          <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
            <option>Select opportunity</option>
          </select>
        </div>

        {/* Quote */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quote
          </label>
          <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
            <option>Select quote</option>
          </select>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe about contact"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Button */}
      <div className="mt-10">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-8 py-2.5 rounded-md transition"
        >
          {mode === "create" ? "Create" : "Update"}
        </button>
      </div>
    </form>
  );
}
