"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Upload, X, ArrowLeft, Paperclip } from "lucide-react";
import {
  getTicketById,
  createTicketReply,
  updateTicketStatusById,
  TicketDetail,
  Reply,
} from "@/app/services/tickets/tickets.service";
import { getAllActiveTicketStatus } from "@/app/services/ticket-status/ticket-status.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { useError } from "@/app/providers/ErrorProvider";
import StatusBadge from "@/app/common/StatusBadge";
import { getFileUrl } from "@/app/services/File/file.service";

const priorityColorMap: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  low: {
    bg: "bg-brand-50",
    text: "text-brand-500",
    border: "border-brand-200",
  },
  medium: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  high: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  urgent: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

const statusColorMap: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  open: {
    bg: "bg-brand-50",
    text: "text-brand-500",
    border: "border-brand-200",
  },
  in_progress: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  resolved: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  closed: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};

export default function TicketViewPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  const { showError, showSuccess } = useError();

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statuses, setStatuses] = useState<OptionDropDownModel[]>([]);

  const fetchTicket = async () => {
    if (!ticketId) return;

    try {
      setLoading(true);
      const response = await getTicketById(Number(ticketId));
      if (response.isSuccess && response.data) {
        setTicket(response.data);
      } else {
        showError(response.message || "Failed to fetch ticket");
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
      showError("Failed to fetch ticket");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await getAllActiveTicketStatus();
      if (response.isSuccess && response.data) {
        setStatuses(response.data);
      }
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  useEffect(() => {
    fetchTicket();
    fetchStatuses();
  }, [ticketId]);

  const handleReplySubmit = async (description: string, file: File | null) => {
    if (!description.trim()) {
      showError("Please enter a description");
      return;
    }

    try {
      const response = await createTicketReply(Number(ticketId), {
        description,
        attachment: file as File,
      });

      if (response.isSuccess) {
        showSuccess("Reply added successfully");
        setShowReplyModal(false);
        fetchTicket();
      } else {
        showError(response.message || "Failed to add reply");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      showError("Failed to add reply");
    }
  };

  const handleStatusSave = async (statusId: number) => {
    if (!ticket) return;

    try {
      const response = await updateTicketStatusById(ticket.id, statusId);
      if (response.isSuccess) {
        showSuccess("Status updated successfully");
        setShowStatusModal(false);
        fetchTicket();
      } else {
        showError(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showError("Failed to update status");
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/tickets")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={18} />
          <span>Back to Tickets</span>
        </button>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-3">
              Support Ticket #TKT-{String(ticket.id).padStart(4, "0")}
              <StatusBadge
                status={ticket.status?.name || "N/A"}
                colorMap={statusColorMap}
                variant="default"
              />
            </h2>
            <p className="text-sm text-gray-500 mt-1">{ticket.email}</p>
          </div>

          <button
            onClick={() => setShowStatusModal(true)}
            className="bg-brand-500 text-white px-4 py-2 rounded text-sm hover:bg-brand-600"
          >
            Update Status
          </button>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="border px-3 py-1.5 rounded-md bg-gray-50">
            <span className="text-gray-500">Customer:</span>{" "}
            <span className="font-medium">
              {ticket.customer?.name || "N/A"}
            </span>
          </span>
          <span className="border px-3 py-1.5 rounded-md bg-gray-50">
            <span className="text-gray-500">Category:</span>{" "}
            <span className="font-medium">
              {ticket.category?.name || "N/A"}
            </span>
          </span>
          <span className="border px-3 py-1.5 rounded-md bg-gray-50">
            <span className="text-gray-500">Priority:</span>{" "}
            <StatusBadge
              status={ticket.priority?.name || "N/A"}
              colorMap={priorityColorMap}
              variant="default"
            />
          </span>
        </div>

        {/* Ticket body */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="font-medium text-lg">{ticket.subject}</p>
          <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
            {ticket.description}
          </p>

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Attachments
              </p>
              <div className="flex flex-wrap gap-2">
                {ticket.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={getFileUrl(attachment.file_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 border rounded-md text-sm text-brand-500 hover:bg-brand-50"
                  >
                    <Paperclip size={14} />
                    {attachment.file_name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Replies Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">
            Replies ({ticket.replies?.length || 0})
          </h3>

          {ticket.replies && ticket.replies.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {ticket.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-gray-50 p-4 rounded-lg border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-gray-800">
                      {reply.user?.name || "Unknown User"}
                    </p>
                    <span className="text-xs text-gray-400">
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {reply.description}
                  </p>

                  {/* Reply Attachments */}
                  {reply.attachments && reply.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex flex-wrap gap-2">
                        {reply.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={getFileUrl(attachment.file_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-1 bg-white border rounded text-xs text-brand-500 hover:bg-brand-50"
                          >
                            <Paperclip size={12} />
                            {attachment.file_name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No replies yet</p>
          )}
        </div>

        {/* Reply Button */}
        <div className="text-center pt-4 border-t">
          <button
            onClick={() => setShowReplyModal(true)}
            className="bg-brand-500 text-white px-6 py-2 rounded hover:bg-brand-600"
          >
            Reply
          </button>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <ReplyModal
          onClose={() => setShowReplyModal(false)}
          onSubmit={handleReplySubmit}
        />
      )}

      {/* Update Status Modal */}
      {showStatusModal && (
        <UpdateStatusModal
          currentStatusId={ticket.ticket_status_id}
          statuses={statuses}
          onClose={() => setShowStatusModal(false)}
          onSave={handleStatusSave}
        />
      )}
    </div>
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
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

function ReplyModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (message: string, file: File | null) => void;
}) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit(message, file);
    setSubmitting(false);
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="font-semibold text-lg mb-4">Reply to Ticket</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Enter your reply..."
          />
        </div>

        {/* Attachment */}
        <div>
          <label className="text-sm font-medium">Attachment</label>
          <div
            className="mt-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-brand-400"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto text-brand-500 mb-2" size={24} />
            <p className="text-sm">
              {file ? (
                <span className="text-brand-500">{file.name}</span>
              ) : (
                <>
                  Drag and drop or{" "}
                  <span className="text-brand-500">click to select</span>
                </>
              )}
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, PDF</p>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          {file && (
            <button
              onClick={() => setFile(null)}
              className="text-xs text-red-500 mt-1 hover:underline"
            >
              Remove file
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="border px-4 py-2 rounded-md text-sm hover:bg-gray-50"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-brand-500 text-white px-6 py-2 rounded-md text-sm hover:bg-brand-600 disabled:opacity-50"
          disabled={submitting || !message.trim()}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </Modal>
  );
}

function UpdateStatusModal({
  currentStatusId,
  statuses,
  onClose,
  onSave,
}: {
  currentStatusId: number;
  statuses: OptionDropDownModel[];
  onClose: () => void;
  onSave: (statusId: number) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatusId);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(selectedStatus);
    setSaving(false);
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="font-semibold text-lg mb-4">Update Ticket Status</h3>

      <div>
        <label className="text-sm font-medium">Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(Number(e.target.value))}
          className="w-full border rounded-md px-3 py-2 mt-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="border px-4 py-2 rounded-md text-sm hover:bg-gray-50"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-brand-500 text-white px-4 py-2 rounded-md text-sm hover:bg-brand-600 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
}
