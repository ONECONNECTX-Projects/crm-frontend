"use client";

import { useState, useEffect, useRef } from "react";
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
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";

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
  const [errors, setErrors] = useState<{
    to_email?: string;
    subject?: string;
    body?: string;
  }>({});
  const editorRef = useRef<HTMLDivElement>(null);

  const applyStyle = (style: "bold" | "italic" | "underline") => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    document.execCommand(style);
  };

  const applyFormat = (tag: "h1" | "h2") => {
    if (!editorRef.current) return;

    document.execCommand("formatBlock", false, tag);
  };
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

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setAttachments((prev) => [...prev, ...Array.from(files)]);
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async () => {
    const newErrors: typeof errors = {};

    if (!form.to_email.trim()) {
      newErrors.to_email = "To email is required";
    }

    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = form.body;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    if (!plainText.trim()) {
      newErrors.body = "Body is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // clear errors if valid

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
        <InputField
          label="To"
          error={errors.to_email}
          value={form.to_email}
          onChange={(value) => handleChange("to_email", value)}
          disabled={isView}
          placeholder="Receiver Email"
          noLeadingSpace
          required
        />
      </div>

      {/* Subject */}
      <div className="mt-5">
        <InputField
          label="Subject"
          value={form.subject}
          onChange={(value) => handleChange("subject", value)}
          disabled={isView}
          noLeadingSpace
          required
          error={errors.subject}
          placeholder="Subject"
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
            <InputField
              label="cc"
              value={form.cc}
              onChange={(value) => handleChange("cc", value)}
              disabled={isView}
              placeholder="CC"
              noLeadingSpace
            />
            <InputField
              label="bcc"
              value={form.bcc}
              noLeadingSpace
              onChange={(value) => handleChange("bcc", value)}
              disabled={isView}
              placeholder="BCC"
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="mt-6">
        {/* Toolbar */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Body
          </label>

          {/* Toolbar */}
          <div className="border rounded-t-md px-3 py-2 text-sm text-gray-600 flex gap-4 bg-gray-50">
            <button
              type="button"
              onClick={() => applyFormat("h1")}
              className="font-semibold"
            >
              H1
            </button>

            <button
              type="button"
              onClick={() => applyFormat("h2")}
              className="font-semibold"
            >
              H2
            </button>

            <button type="button" onClick={() => applyStyle("bold")}>
              <span className="font-bold">B</span>
            </button>

            <button type="button" onClick={() => applyStyle("italic")}>
              <span className="italic">I</span>
            </button>

            <button type="button" onClick={() => applyStyle("underline")}>
              <span className="underline">U</span>
            </button>
          </div>
        </div>

        {/* Editable Area */}
        <div
          ref={editorRef}
          contentEditable={!isView}
          suppressContentEditableWarning
          className={`border border-t-0 rounded-b-md px-3 py-2 min-h-[150px] focus:outline-none ${
            errors.body ? "border-red-500" : ""
          }`}
          onInput={(e) => {
            const html = e.currentTarget.innerHTML;
            handleChange("body", html);

            if (errors.body) {
              setErrors((prev) => ({ ...prev, body: undefined }));
            }
          }}
        />
      </div>

      {/* Company */}
      <div className="mt-5">
        <SelectDropdown
          label="Company"
          options={companies.map((source) => ({
            label: source.name,
            value: source.id,
          }))}
          value={form.company_id}
          onChange={(value) => handleChange("company_id", value)}
          disabled={isView}
        ></SelectDropdown>
      </div>

      {/* Contact */}
      <div className="mt-5">
        <SelectDropdown
          label="Contact"
          options={contacts.map((source) => ({
            label: source.name,
            value: source.id,
          }))}
          value={form.contact_id}
          onChange={(value) => handleChange("contact_id", value)}
          disabled={isView}
        ></SelectDropdown>
      </div>

      {/* Opportunity */}
      <div className="mt-5">
        <SelectDropdown
          label="Opportunity"
          value={form.opportunity_id}
          options={opportunities.map((source) => ({
            label: source.name,
            value: source.id,
          }))}
          onChange={(value) => handleChange("opportunity_id", value)}
          disabled={isView}
          className="w-full border rounded-md px-3 py-2 text-sm"
        ></SelectDropdown>
      </div>

      {/* Quote */}
      <div className="mt-5">
        <SelectDropdown
          label="Quote"
          value={form.quote_id}
          options={quotes.map((source) => ({
            label: source.name,
            value: source.id,
          }))}
          onChange={(value) => handleChange("quote_id", value)}
          disabled={isView}
        ></SelectDropdown>
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
