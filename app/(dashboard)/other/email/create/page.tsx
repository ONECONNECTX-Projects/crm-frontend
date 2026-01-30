"use client";

import { useState } from "react";
import { X, ChevronDown, Plus, Paperclip, Trash2 } from "lucide-react";

type Mode = "create" | "edit" | "view";

interface EmailFormProps {
  mode?: Mode;
  email?: any;
  onClose?: () => void;
}

export default function EmailForm({
  mode = "create",
  email,
  onClose,
}: EmailFormProps) {
  const [showCC, setShowCC] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const isView = mode === "view";

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setAttachments((prev) => [...prev, ...Array.from(files)]);
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <X
          onClick={onClose}
          className="text-gray-500 hover:text-black cursor-pointer"
        />
        <h1 className="text-xl font-semibold">
          {mode === "create" ? "Create Email" : "Edit Email"}
        </h1>
      </div>

      {/* To */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="text-red-500">*</span> To
        </label>
        <input
          disabled={isView}
          placeholder="Receiver Email"
          className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:outline-none"
        />
      </div>

      {/* Subject */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="text-red-500">*</span> Subject
        </label>
        <input
          disabled={isView}
          placeholder="Subject"
          className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:outline-none"
        />
      </div>

      {/* CC & BCC */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowCC(!showCC)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <ChevronDown
            size={16}
            className={`transition-transform ${showCC ? "rotate-180" : ""}`}
          />
          CC & BCC
        </button>

        {showCC && (
          <div className="bg-gray-50 border rounded-md p-4 mt-3 space-y-3">
            <input
              disabled={isView}
              placeholder="CC"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <input
              disabled={isView}
              placeholder="BCC"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Body
        </label>

        <div className="border rounded-t-md px-3 py-2 text-sm text-gray-600 flex gap-4 bg-gray-50">
          <span className="font-semibold">H1</span>
          <span className="font-semibold">H2</span>
          <span>Sans Serif</span>
          <span className="font-bold">B</span>
          <span className="italic">I</span>
          <span className="underline">U</span>
        </div>

        <textarea
          disabled={isView}
          rows={6}
          className="w-full border border-t-0 rounded-b-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:outline-none"
        />
      </div>

      {/* Owner */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email owner
        </label>
        <select
          disabled={isView}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option>John Doe</option>
        </select>
      </div>

      {/* Relations */}
      {["Company", "Contact", "Opportunity", "Quote"].map((label) => (
        <div key={label} className="mt-5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            {label}
            {!isView && (
              <Plus size={14} className="text-brand-500 cursor-pointer" />
            )}
          </label>
          <select
            disabled={isView}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option>Select {label.toLowerCase()}</option>
          </select>
        </div>
      ))}

      {/* Attachments */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Attachments
        </label>

        {!isView && (
          <label className="flex items-center gap-2 cursor-pointer text-brand-500 text-sm font-medium">
            <Paperclip size={16} />
            Attach files or images
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        )}

        {attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2 text-sm"
              >
                <span className="truncate max-w-xs">{file.name}</span>
                {!isView && (
                  <Trash2
                    size={16}
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeFile(index)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {!isView && (
        <div className="flex gap-4 mt-8">
          <button className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-md text-sm">
            {mode === "create" ? "Create" : "Update"}
          </button>

          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
