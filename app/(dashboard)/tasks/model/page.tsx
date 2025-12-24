"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  taskId: string;
  onClose: () => void;
  onSubmit: (reply: any) => void;
}

export default function ReplyModal({ taskId, onClose, onSubmit }: Props) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = () => {
    if (!message.trim()) return;

    onSubmit({
      id: Date.now(),
      message,
      createdAt: "Just now",
      attachments: files.map((f) => f.name),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Reply Task #{taskId}</h2>

        {/* Description */}
        <label className="text-sm font-medium">Description *</label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your reply..."
          className="w-full border rounded-md mt-1 px-3 py-2"
        />

        {/* Attachment */}
        <div className="mt-4">
          <label className="text-sm font-medium">Attachments</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="mt-2"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
