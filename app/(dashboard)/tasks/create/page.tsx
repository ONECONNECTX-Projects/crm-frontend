"use client";

import { X, Plus, Calendar } from "lucide-react";

export default function CreateTask({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center gap-2">
          <button onClick={onClose}>
            <X size={18} />
          </button>
          <h2 className="text-lg font-semibold">Create Task</h2>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Task Name */}
        <Input label="* Task name" placeholder="Example name" />

        {/* Assignee + Company */}
        <div className="grid grid-cols-2 gap-6">
          <Select label="Assignee" options={["demo"]} />
          <Select label="Company" plus options={["Company A"]} />
        </div>

        {/* Contact */}
        <Select label="Contact" plus options={["Contact A"]} />

        {/* Opportunity + Quote */}
        <div className="grid grid-cols-2 gap-6">
          <Select label="Opportunity" plus options={["Test Opportunity"]} />
          <Select label="Quote" plus options={["Quote A"]} />
        </div>

        {/* Task Type + Priority */}
        <div className="grid grid-cols-2 gap-6">
          <Select
            label="Task Type"
            plus
            options={["Call", "Email", "Meeting"]}
          />
          <Select
            label="Task Priority"
            plus
            options={["Low", "Medium", "High"]}
          />
        </div>

        {/* Task Status */}
        <Select
          label="Task Status"
          plus
          options={["Pending", "In Progress", "Completed"]}
        />

        {/* Due Date */}
        <DateInput label="Due date" />

        {/* Description */}
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            rows={4}
            placeholder="Descriptions"
            className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-4">
          <button className="bg-blue-600 text-white px-16 py-2.5 rounded-md text-sm font-medium">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Fields ---------- */

function Input({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">
        <span className="text-red-500">*</span> {label.replace("* ", "")}
      </label>
      <input
        placeholder={placeholder}
        className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
      />
    </div>
  );
}

function DateInput({ label }: { label: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="relative mt-1">
        <input
          type="date"
          className="w-full border rounded-md px-3 py-2 text-sm pr-10"
        />
        <Calendar
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}

function Select({
  label,
  options,
  plus,
}: {
  label: string;
  options: string[];
  plus?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium">
        {label}
        {plus && (
          <span className="bg-blue-600 text-white rounded p-[2px]">
            <Plus size={12} />
          </span>
        )}
      </label>
      <select className="w-full mt-1 border rounded-md px-3 py-2 text-sm">
        <option>Select {label}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
