"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { createTicket } from "@/app/services/tickets/tickets.service";
import { getAllActiveContacts } from "@/app/services/contact/contact.service";
import { getAllActiveTicketCategory } from "@/app/services/ticket-category/ticket-category.service";
import { getAllActivePriority } from "@/app/services/priority/priority.service";
import { getAllActiveTicketStatus } from "@/app/services/ticket-status/ticket-status.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { useError } from "@/app/providers/ErrorProvider";

interface TicketFormData {
  email: string;
  contact_id: string | "";
  ticket_category_id: number | "";
  priority_id: number | "";
  ticket_status_id: number | "";
  subject: string;
  description: string;
  attachments: File | null;
}

interface TicketFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const defaultForm: TicketFormData = {
  email: "",
  contact_id: "",
  ticket_category_id: "",
  priority_id: "",
  ticket_status_id: "",
  subject: "",
  description: "",
  attachments: null,
};

const ACCEPTED_TYPES = [".png", ".jpg", ".jpeg", ".pdf"];

export default function TicketForm({ onSuccess, onCancel }: TicketFormProps) {
  const [form, setForm] = useState<TicketFormData>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showError, showSuccess } = useError();

  // Dropdown options
  const [contacts, setContacts] = useState<OptionDropDownModel[]>([]);
  const [categories, setCategories] = useState<OptionDropDownModel[]>([]);
  const [priorities, setPriorities] = useState<OptionDropDownModel[]>([]);
  const [statuses, setStatuses] = useState<OptionDropDownModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        setLoading(true);
        const [contactsRes, categoriesRes, prioritiesRes, statusesRes] =
          await Promise.all([
            getAllActiveContacts(),
            getAllActiveTicketCategory(),
            getAllActivePriority(),
            getAllActiveTicketStatus(),
          ]);

        if (contactsRes.isSuccess && contactsRes.data) {
          setContacts(contactsRes.data);
        }
        if (categoriesRes.isSuccess && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
        if (prioritiesRes.isSuccess && prioritiesRes.data) {
          setPriorities(prioritiesRes.data);
        }
        if (statusesRes.isSuccess && statusesRes.data) {
          setStatuses(statusesRes.data);
        }
      } catch (error) {
        console.error("Error fetching dropdowns:", error);
        showError("Failed to load form options");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  const update = (key: keyof TicketFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    const isValidType = ACCEPTED_TYPES.some((type) =>
      selectedFile.name.toLowerCase().endsWith(type),
    );

    if (isValidType) {
      update("attachments", selectedFile);
    } else {
      showError("Invalid file type. Please upload PNG, JPG, JPEG, or PDF.");
    }
  };

  const removeFile = () => {
    update("attachments", null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.contact_id) {
      showError("Please select a customer");
      return;
    }
    if (!form.subject.trim()) {
      showError("Please enter a subject");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("contact_id", form.contact_id);
      formData.append("subject", form.subject);
      formData.append("description", form.description);

      if (form.ticket_category_id) {
        formData.append("ticket_category_id", String(form.ticket_category_id));
      }
      if (form.priority_id) {
        formData.append("priority_id", String(form.priority_id));
      }
      if (form.ticket_status_id) {
        formData.append("ticket_status_id", String(form.ticket_status_id));
      }

      // Add attachment
      if (form.attachments) {
        formData.append("attachments", form.attachments);
      }

      const response = await createTicket(
        formData as unknown as Parameters<typeof createTicket>[0],
      );

      if (response.isSuccess) {
        showSuccess("Ticket created successfully");
        onSuccess();
      } else {
        showError(response.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      showError("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">CREATE A TICKET</h2>

      {/* Email */}
      <div>
        <label className="text-sm font-medium">Email Address</label>
        <input
          type="email"
          placeholder="youremail@something.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Customer */}
      <div>
        <label className="text-sm font-medium">
          Customer <span className="text-red-500">*</span>
        </label>
        <select
          value={form.contact_id}
          onChange={(e) =>
            update("contact_id", e.target.value ? Number(e.target.value) : "")
          }
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Select a Customer</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ticket Category */}
      <div>
        <label className="text-sm font-medium">Ticket Category</label>
        <select
          value={form.ticket_category_id}
          onChange={(e) =>
            update(
              "ticket_category_id",
              e.target.value ? Number(e.target.value) : "",
            )
          }
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <div>
        <label className="text-sm font-medium">Priority</label>
        <select
          value={form.priority_id}
          onChange={(e) =>
            update("priority_id", e.target.value ? Number(e.target.value) : "")
          }
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Select a priority</option>
          {priorities.map((priority) => (
            <option key={priority.id} value={priority.id}>
              {priority.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="text-sm font-medium">Status</label>
        <select
          value={form.ticket_status_id}
          onChange={(e) =>
            update(
              "ticket_status_id",
              e.target.value ? Number(e.target.value) : "",
            )
          }
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Select a status</option>
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div>
        <label className="text-sm font-medium">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter ticket subject"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          rows={4}
          placeholder="Enter ticket description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Attachment */}
      <div>
        <label className="text-sm font-medium">Attachment</label>

        {!form.attachments ? (
          <div
            className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-brand-400 transition"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileSelect(e.dataTransfer.files);
            }}
          >
            <Upload className="mx-auto mb-2 text-brand-500" />
            <p className="text-sm">
              Drag and drop a file or{" "}
              <span className="text-brand-500 font-medium">
                click to select
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported: PNG, JPG, JPEG, PDF
            </p>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept={ACCEPTED_TYPES.join(",")}
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between border rounded-lg px-4 py-3 bg-gray-50">
            <span className="text-sm truncate">{form.attachments.name}</span>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 ml-3"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-brand-500 text-white rounded-md text-sm hover:bg-brand-600 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Ticket"}
        </button>
      </div>
    </div>
  );
}
