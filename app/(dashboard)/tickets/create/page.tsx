"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTicket } from "@/app/services/tickets/tickets.service";
import { getAllActiveContacts } from "@/app/services/contact/contact.service";
import { getAllActiveTicketCategory } from "@/app/services/ticket-category/ticket-category.service";
import { getAllActivePriority } from "@/app/services/priority/priority.service";
import { getAllActiveTicketStatus } from "@/app/services/ticket-status/ticket-status.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { useError } from "@/app/providers/ErrorProvider";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";

interface TicketFormData {
  email: string;
  contact_id: string;
  ticket_category_id: string;
  priority_id: string;
  ticket_status_id: string;
  subject: string;
  description: string;
  attachments: File | null;
}

interface TicketFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  defaultContactId?: number;
}

const ACCEPTED_TYPES = [".png", ".jpg", ".jpeg", ".pdf"];

export default function TicketForm({
  onSuccess,
  onCancel,
  defaultContactId,
}: TicketFormProps) {
  const [form, setForm] = useState<TicketFormData>({
    email: "",
    contact_id: defaultContactId ? String(defaultContactId) : "",
    ticket_category_id: "",
    priority_id: "",
    ticket_status_id: "",
    subject: "",
    description: "",
    attachments: null,
  });
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

        if (contactsRes.isSuccess && contactsRes.data)
          setContacts(contactsRes.data);
        if (categoriesRes.isSuccess && categoriesRes.data)
          setCategories(categoriesRes.data);
        if (prioritiesRes.isSuccess && prioritiesRes.data)
          setPriorities(prioritiesRes.data);
        if (statusesRes.isSuccess && statusesRes.data)
          setStatuses(statusesRes.data);
      } catch (error) {
        console.error("Error fetching dropdowns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  const handleChange = (key: keyof TicketFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toOptions = (list: OptionDropDownModel[]) =>
    list.map((item) => ({ label: item.name, value: item.id }));

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    const isValidType = ACCEPTED_TYPES.some((type) =>
      selectedFile.name.toLowerCase().endsWith(type),
    );

    if (isValidType) {
      setForm((prev) => ({ ...prev, attachments: selectedFile }));
    } else {
      showError("Invalid file type. Please upload PNG, JPG, JPEG, or PDF.");
    }
  };

  const removeFile = () => {
    setForm((prev) => ({ ...prev, attachments: null }));
  };

  const handleSubmit = async () => {
    if (!form.email.trim()) {
      showError("Email is required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      showError("Invalid email format");
      return;
    }
    if (!form.contact_id) {
      showError("Customer is required");
      return;
    }
    if (!form.ticket_category_id) {
      showError("Ticket Category is required");
      return;
    }
    if (!form.subject.trim()) {
      showError("Subject is required");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("contact_id", form.contact_id);
      formData.append("ticket_category_id", form.ticket_category_id);
      formData.append("subject", form.subject);
      if (form.priority_id) formData.append("priority_id", form.priority_id);
      if (form.ticket_status_id) formData.append("ticket_status_id", form.ticket_status_id);
      if (form.description.trim()) formData.append("description", form.description);

      if (form.attachments) {
        formData.append("attachments", form.attachments);
      }

      const response = await createTicket(
        formData as unknown as Parameters<typeof createTicket>[0],
      );

      if (response.isSuccess) {
        showSuccess("Ticket created successfully");
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
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
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Create Ticket</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <InputField
            label="Email Address"
            required
            type="email"
            placeholder="youremail@something.com"
            value={form.email}
            onChange={(v) => handleChange("email", v)}
            noLeadingSpace
          />

          <SelectDropdown
            label="Customer"
            required
            value={form.contact_id}
            options={toOptions(contacts)}
            placeholder="Select a Customer"
            onChange={(v) => handleChange("contact_id", v)}
          />

          <SelectDropdown
            label="Ticket Category"
            required
            value={form.ticket_category_id}
            options={toOptions(categories)}
            placeholder="Select a Category"
            onChange={(v) => handleChange("ticket_category_id", v)}
          />

          <SelectDropdown
            label="Priority"
            value={form.priority_id}
            options={toOptions(priorities)}
            placeholder="Select a Priority"
            onChange={(v) => handleChange("priority_id", v)}
          />

          <SelectDropdown
            label="Status"
            value={form.ticket_status_id}
            options={toOptions(statuses)}
            placeholder="Select a Status"
            onChange={(v) => handleChange("ticket_status_id", v)}
          />

          <InputField
            label="Subject"
            required
            placeholder="Enter ticket subject"
            value={form.subject}
            onChange={(v) => handleChange("subject", v)}
          />

          <div className="md:col-span-2">
            <InputField
              label="Description"
              placeholder="Enter ticket description"
              value={form.description}
              onChange={(v) => handleChange("description", v)}
              multiline
              rows={4}
            />
          </div>

          {/* Attachment */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Attachment
            </label>

            {!form.attachments ? (
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-brand-400 transition"
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
              <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-gray-50">
                <span className="text-sm truncate">
                  {form.attachments.name}
                </span>
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
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
        <Button variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-brand-500 hover:bg-brand-600"
        >
          {submitting ? "Creating..." : "Create Ticket"}
        </Button>
      </div>
    </div>
  );
}
