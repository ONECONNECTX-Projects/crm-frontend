"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  resolveTime: string;
}

interface Reply {
  id: number;
  ticketId: string;
  author: string;
  message: string;
  createdAt: string;
}

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  resolveTime: string;
}

interface Reply {
  id: number;
  ticketId: string;
  author: string;
  message: string;
  createdAt: string;
}

export default function TicketViewPage() {
  const params = useParams();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    if (!ticketId) return;

    setTicket({
      id: ticketId,
      subject: "App crashes on Android 14",
      description: "Crash when opening notifications screen.",
      status: "closed",
      category: "Billing",
      priority: "Low",
      resolveTime: "2:0",
    });

    setReplies([
      {
        id: 1,
        ticketId,
        author: "DEMO",
        message: "cswdc",
        createdAt: "a few seconds ago",
      },
    ]);
  }, [ticketId]);

  const handleReplySubmit = (message: string) => {
    if (!message.trim()) return;

    setReplies((prev) => [
      ...prev,
      {
        id: Date.now(),
        ticketId,
        author: "Admin",
        message,
        createdAt: "Just now",
      },
    ]);
  };

  const handleStatusSave = (status: string) => {
    setTicket((prev) => (prev ? { ...prev, status } : prev));
    setShowStatusModal(false);
  };

  if (!ticket) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between">
          <h2 className="font-semibold">
            Support Ticket #{ticket.id}
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
              {ticket.status}
            </span>
          </h2>

          <button
            onClick={() => setShowStatusModal(true)}
            className="bg-brand-500 text-white px-4 py-2 rounded text-sm"
          >
            Update Status
          </button>
        </div>

        {/* Meta */}
        <div className="flex gap-2 text-xs">
          <span className="border px-2 py-1 rounded">
            Category: {ticket.category}
          </span>
          <span className="border px-2 py-1 rounded">
            Priority: {ticket.priority}
          </span>
          <span className="border px-2 py-1 rounded">
            Resolve Time: {ticket.resolveTime}
          </span>
        </div>

        {/* Ticket body */}
        <div className="border rounded p-4">
          <p className="font-medium">Subject: {ticket.subject}</p>
          <p className="text-sm text-gray-600">{ticket.description}</p>
        </div>

        {/* Replies */}
        {replies.map((reply) => (
          <div key={reply.id} className="bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium">
              {reply.author}
              <span className="ml-2 text-xs text-gray-400">
                {reply.createdAt}
              </span>
            </p>
            <p className="text-sm">{reply.message}</p>
          </div>
        ))}

        <div className="text-center">
          <button
            onClick={() => setShowReplyModal(true)}
            className="bg-brand-500 text-white px-6 py-2 rounded"
          >
            Reply
          </button>
        </div>
      </div>

      {showReplyModal && (
        <ReplyModal
          onClose={() => setShowReplyModal(false)}
          onSubmit={(msg) => {
            handleReplySubmit(msg);
            setShowReplyModal(false);
          }}
        />
      )}

      {showStatusModal && (
        <UpdateStatusModal
          status={ticket.status}
          onClose={() => setShowStatusModal(false)}
          onSave={handleStatusSave}
        />
      )}
    </div>
  );
}

function ReplyModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (msg: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Modal onClose={onClose}>
      <h3 className="font-semibold mb-4">Reply Support Ticket</h3>

      <label className="text-sm font-medium text-red-500">* Description</label>
      <textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border rounded px-3 py-2 mt-1"
        placeholder="In the ticket"
      />

      {/* Attachment */}
      <div
        className="border-2 border-dashed rounded-lg p-6 mt-4 text-center cursor-pointer"
        onClick={() => document.getElementById("replyFile")?.click()}
      >
        <Upload className="mx-auto text-brand-500 mb-2" />
        <p className="text-sm">
          Drag and drop files or{" "}
          <span className="text-brand-500">click to select</span>
        </p>
        <p className="text-xs text-gray-400">PNG, JPG, JPEG, PDF</p>
        <input
          id="replyFile"
          type="file"
          multiple
          hidden
          onChange={(e) => setFiles([...files, ...(e.target.files || [])])}
        />
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onClose} className="border px-4 py-2 rounded">
          Cancel
        </button>
        <button
          onClick={() => onSubmit(message)}
          className="bg-brand-500 text-white px-6 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
}
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
function UpdateStatusModal({
  status,
  onClose,
  onSave,
}: {
  status: string;
  onClose: () => void;
  onSave: (s: string) => void;
}) {
  const [value, setValue] = useState(status);

  return (
    <Modal onClose={onClose}>
      <h3 className="font-semibold mb-4">Update Ticket Status</h3>

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-6"
      >
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>

      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="border px-4 py-2 rounded">
          Cancel
        </button>
        <button
          onClick={() => onSave(value)}
          className="bg-brand-500 text-white px-4 py-2 rounded"
        >
          OK
        </button>
      </div>
    </Modal>
  );
}
