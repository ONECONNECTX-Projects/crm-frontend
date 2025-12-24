"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";

export type TicketFormMode = "create" | "edit";

export interface TicketFormData {
  email: string;
  customer: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  attachments: File[];
}

interface TicketFormProps {
  mode: TicketFormMode;
  initialData?: Partial<TicketFormData>;
  onSubmit: (data: TicketFormData) => void;
  onCancel: () => void;
}

const defaultForm: TicketFormData = {
  email: "",
  customer: "",
  category: "",
  priority: "",
  subject: "",
  description: "",
  attachments: [],
};

const ACCEPTED_TYPES = [".png", ".jpg", ".jpeg", ".pdf"];

export default function TicketForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: TicketFormProps) {
  const [form, setForm] = useState<TicketFormData>(defaultForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [mode, initialData]);

  const update = (key: keyof TicketFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;

    const valid = Array.from(files).filter((file) =>
      ACCEPTED_TYPES.some((type) => file.name.toLowerCase().endsWith(type))
    );

    update("attachments", [...form.attachments, ...valid]);
  };

  const removeFile = (index: number) => {
    update(
      "attachments",
      form.attachments.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">
        {mode === "create" ? "CREATE A TICKET" : "EDIT TICKET"}
      </h2>

      {/* Email */}
      <div>
        <label className="text-sm font-medium">Email Address</label>
        <input
          type="email"
          placeholder="youremail@something.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Customer */}
      <div>
        <label className="text-sm font-medium text-red-500">* Customer</label>
        <select
          value={form.customer}
          onChange={(e) => update("customer", e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white"
        >
          <option value="">Select a Customer</option>
          <option value="acme">Acme Corporation</option>
          <option value="tech">Tech Solutions Inc</option>
        </select>
      </div>

      {/* Ticket Category */}
      <div>
        <label className="text-sm font-medium">Ticket Category</label>
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white"
        >
          <option value="">Select a category</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature Request</option>
          <option value="support">Support</option>
        </select>
      </div>

      {/* Priority */}
      <div>
        <label className="text-sm font-medium">Priority</label>
        <select
          value={form.priority}
          onChange={(e) => update("priority", e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white"
        >
          <option value="">Select a priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Subject */}
      <div>
        <label className="text-sm font-medium text-red-500">* Subject</label>
        <input
          type="text"
          placeholder="Fix issue"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          rows={4}
          placeholder="In the ticket"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm resize-none"
        />
      </div>

      {/* Attachments */}
      <div>
        <label className="text-sm font-medium">Attachments</label>

        <div
          className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
        >
          <Upload className="mx-auto mb-2 text-blue-500" />
          <p className="text-sm">
            Drag and drop files or{" "}
            <span className="text-blue-600 font-medium">click to select</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported file types: PNG, JPG, JPEG, PDF
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            accept={ACCEPTED_TYPES.join(",")}
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {/* Selected files */}
        {form.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {form.attachments.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between border rounded px-3 py-2 text-sm"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSubmit(form)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          {mode === "create" ? "Create Ticket" : "Update Ticket"}
        </button>
      </div>
    </div>
  );
}
