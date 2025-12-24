"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function CreateProjectForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    manager: "John Doe",
    contact: "",
    status: "",
    priority: "",
    value: "",
    startDate: "",
    deadline: "",
    description: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log("Create Project:", form);
    onClose();
  };

  return (
    <div className="p-6 space-y-6">
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg font-semibold">Create Project</h2>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* ================= Form ================= */}
      <div className="grid grid-cols-2 gap-6">
        <Input
          label="* Project Name"
          placeholder="Enter Project Name"
          value={form.name}
          onChange={(v) => handleChange("name", v)}
        />

        <Select
          label="Project Manager"
          value={form.manager}
          options={["John Doe", "Jane Smith"]}
          onChange={(v) => handleChange("manager", v)}
        />

        <Select
          label="Contact"
          value={form.contact}
          options={["Carlos Mendez", "Alex Brown"]}
          onChange={(v) => handleChange("contact", v)}
        />

        <Select
          label="Project Status"
          value={form.status}
          options={["planned", "in-progress", "completed"]}
          onChange={(v) => handleChange("status", v)}
        />

        <Select
          label="Priority"
          value={form.priority}
          options={["Lowest", "Low", "Medium", "High", "Highest"]}
          onChange={(v) => handleChange("priority", v)}
        />

        <Input
          label="Project Value"
          placeholder="Enter value"
          value={form.value}
          onChange={(v) => handleChange("value", v)}
        />

        <DateInput
          label="Start Date"
          value={form.startDate}
          onChange={(v) => handleChange("startDate", v)}
        />

        <DateInput
          label="Deadline"
          value={form.deadline}
          onChange={(v) => handleChange("deadline", v)}
        />
      </div>

      {/* ================= Description ================= */}
      <div>
        <label className="text-sm font-medium">Project Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter Project Description"
          rows={4}
          className="w-full mt-1 border rounded-md px-3 py-2"
        />
      </div>

      {/* ================= Footer ================= */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded-md"
      >
        Add Project
      </button>
    </div>
  );
}

/* ================= Reusable Fields ================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-md px-3 py-2"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-md px-3 py-2 bg-white"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-md px-3 py-2"
      />
    </div>
  );
}
