"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, Paperclip, Trash2 } from "lucide-react";
import { useError } from "@/app/providers/ErrorProvider";
import {
  SendEmailPayload,
  sendEmail,
} from "@/app/services/email-config/email.service";
import { getAllActiveCompany } from "@/app/services/company/company.service";
import { getAllActiveContacts } from "@/app/services/contact/contact.service";
import { getAllActiveOpportunity } from "@/app/services/opportunity/opportunity.service";
import { getAllActiveQuotes } from "@/app/services/quote/quote.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";

type Mode = "create" | "edit" | "view";

interface EmailFormProps {
  mode?: Mode;
  email?: any;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function EmailForm({
  mode = "create",
  email,
  onClose,
  onSuccess,
}: EmailFormProps) {
  const { showSuccess, showError } = useError();
  const [showCC, setShowCC] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    to_email: "",
    subject: "",
    body: "",
    cc: "",
    bcc: "",
    contact_id: "",
    company_id: "",
    opportunity_id: "",
    quote_id: "",
  });

  const [companies, setCompanies] = useState<OptionDropDownModel[]>([]);
  const [contacts, setContacts] = useState<OptionDropDownModel[]>([]);
  const [opportunities, setOpportunities] = useState<OptionDropDownModel[]>([]);
  const [quotes, setQuotes] = useState<OptionDropDownModel[]>([]);

  const isView = mode === "view";

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (email && mode === "edit") {
      setForm({
        to_email: email.to_email || email.to || "",
        subject: email.subject || "",
        body: email.body || "",
        cc: email.cc || "",
        bcc: email.bcc || "",
        contact_id: email.contact_id?.toString() || "",
        company_id: email.company_id?.toString() || "",
        opportunity_id: email.opportunity_id?.toString() || "",
        quote_id: email.quote_id?.toString() || "",
      });
      if (email.cc || email.bcc) setShowCC(true);
    }
  }, [email, mode]);

  const fetchDropdowns = async () => {
    try {
      const [companyRes, contactRes, opportunityRes, quoteRes] =
        await Promise.all([
          getAllActiveCompany(),
          getAllActiveContacts(),
          getAllActiveOpportunity(),
          getAllActiveQuotes(),
        ]);
      if (companyRes.data) setCompanies(companyRes.data);
      if (contactRes.data) setContacts(contactRes.data);
      if (opportunityRes.data) setOpportunities(opportunityRes.data);
      if (quoteRes.data) setQuotes(quoteRes.data);
    } catch {
      // Global error handler will show toast
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setAttachments((prev) => [...prev, ...Array.from(files)]);
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.to_email || !form.subject) {
      showError("To and Subject are required");
      return;
    }

    try {
      setSending(true);
      const payload: SendEmailPayload = {
        ...form,
        attachments: attachments.length > 0 ? attachments : undefined,
      };
      const response = await sendEmail(payload);
      if (response.isSuccess) {
        showSuccess("Email sent successfully");
        onSuccess?.();
        onClose?.();
      }
    } catch {
      showError("Failed to send email");
    } finally {
      setSending(false);
    }
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
          name="to_email"
          value={form.to_email}
          onChange={handleChange}
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
          name="subject"
          value={form.subject}
          onChange={handleChange}
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
              name="cc"
              value={form.cc}
              onChange={handleChange}
              disabled={isView}
              placeholder="CC"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <input
              name="bcc"
              value={form.bcc}
              onChange={handleChange}
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
          name="body"
          value={form.body}
          onChange={handleChange}
          disabled={isView}
          rows={6}
          className="w-full border border-t-0 rounded-b-md px-3 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:outline-none"
        />
      </div>

      {/* Company */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company
        </label>
        <select
          name="company_id"
          value={form.company_id}
          onChange={handleChange}
          disabled={isView}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Contact */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact
        </label>
        <select
          name="contact_id"
          value={form.contact_id}
          onChange={handleChange}
          disabled={isView}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select contact</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Opportunity */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Opportunity
        </label>
        <select
          name="opportunity_id"
          value={form.opportunity_id}
          onChange={handleChange}
          disabled={isView}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select opportunity</option>
          {opportunities.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quote */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quote
        </label>
        <select
          name="quote_id"
          value={form.quote_id}
          onChange={handleChange}
          disabled={isView}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select quote</option>
          {quotes.map((q) => (
            <option key={q.id} value={q.id}>
              {q.name}
            </option>
          ))}
        </select>
      </div>

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
          <button
            onClick={handleSubmit}
            disabled={sending}
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-md text-sm disabled:opacity-50"
          >
            {sending ? "Sending..." : mode === "create" ? "Send" : "Update"}
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
