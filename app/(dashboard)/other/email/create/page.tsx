"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Paperclip, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setAttachments((prev) => [...prev, ...Array.from(files)]);
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const toOptions = (list: OptionDropDownModel[]) =>
    list.map((item) => ({ label: item.name, value: item.id }));

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};

    if (!form.to_email.trim()) {
      newErrors.to_email = "To email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.to_email)) {
      newErrors.to_email = "Invalid email format";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = form.body;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    if (!plainText.trim()) newErrors.body = "Body is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

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
      console.error("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "create" ? "Create Email" : "Edit Email"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {/* To & Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <InputField
            label="To"
            required
            error={errors.to_email}
            value={form.to_email}
            onChange={(v) => handleChange("to_email", v)}
            disabled={isView}
            placeholder="Receiver Email"
            noLeadingSpace
          />

          <InputField
            label="Subject"
            required
            value={form.subject}
            onChange={(v) => handleChange("subject", v)}
            disabled={isView}
            noLeadingSpace
            error={errors.subject}
            placeholder="Subject"
          />
        </div>

        {/* CC & BCC */}
        <div>
          <button
            type="button"
            onClick={() => setShowCC(!showCC)}
            className="flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            <ChevronDown
              size={16}
              className={`transition-transform ${showCC ? "rotate-180" : ""}`}
            />
            CC & BCC
          </button>

          {showCC && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-3 bg-gray-50 border rounded-lg p-4">
              <InputField
                label="CC"
                value={form.cc}
                onChange={(v) => handleChange("cc", v)}
                disabled={isView}
                placeholder="CC email addresses"
                noLeadingSpace
              />
              <InputField
                label="BCC"
                value={form.bcc}
                noLeadingSpace
                onChange={(v) => handleChange("bcc", v)}
                disabled={isView}
                placeholder="BCC email addresses"
              />
            </div>
          )}
        </div>

        {/* Body - Rich Text Editor */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
            Body <span className="text-red-500 ml-1">*</span>
          </label>

          {/* Editor wrapper */}
          <div
            className={`border rounded-lg overflow-hidden ${
              errors.body ? "border-red-500" : "border-gray-300"
            }`}
          >
            {/* Toolbar */}
            {!isView && (
              <div className="border-b border-gray-300 px-3 py-2 text-sm text-gray-600 flex items-center gap-1 bg-gray-50">
                <button
                  type="button"
                  onClick={() => applyFormat("h1")}
                  className="px-2 py-1 rounded hover:bg-gray-200 font-semibold"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat("h2")}
                  className="px-2 py-1 rounded hover:bg-gray-200 font-semibold"
                >
                  H2
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <button
                  type="button"
                  onClick={() => applyStyle("bold")}
                  className="px-2 py-1 rounded hover:bg-gray-200"
                >
                  <span className="font-bold">B</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyStyle("italic")}
                  className="px-2 py-1 rounded hover:bg-gray-200"
                >
                  <span className="italic">I</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyStyle("underline")}
                  className="px-2 py-1 rounded hover:bg-gray-200"
                >
                  <span className="underline">U</span>
                </button>
              </div>
            )}

            {/* Editable Area */}
            <div
              ref={editorRef}
              contentEditable={!isView}
              suppressContentEditableWarning
              className="px-3 py-3 min-h-[180px] focus:outline-none text-sm"
              onInput={(e) => {
                const html = e.currentTarget.innerHTML;
                handleChange("body", html);
              }}
            />
          </div>
          {errors.body && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.body}
            </p>
          )}
        </div>

        {/* Dropdowns - 2 column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <SelectDropdown
            label="Company"
            options={toOptions(companies)}
            value={form.company_id}
            onChange={(v) => handleChange("company_id", v)}
            disabled={isView}
            placeholder="Select Company"
          />

          <SelectDropdown
            label="Contact"
            options={toOptions(contacts)}
            value={form.contact_id}
            onChange={(v) => handleChange("contact_id", v)}
            disabled={isView}
            placeholder="Select Contact"
          />

          <SelectDropdown
            label="Opportunity"
            value={form.opportunity_id}
            options={toOptions(opportunities)}
            onChange={(v) => handleChange("opportunity_id", v)}
            disabled={isView}
            placeholder="Select Opportunity"
          />

          <SelectDropdown
            label="Quote"
            value={form.quote_id}
            options={toOptions(quotes)}
            onChange={(v) => handleChange("quote_id", v)}
            disabled={isView}
            placeholder="Select Quote"
          />
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            Attachments
          </label>

          {!isView && (
            <label className="inline-flex items-center gap-2 cursor-pointer text-brand-500 hover:text-brand-600 text-sm font-medium border border-dashed border-brand-300 rounded-lg px-4 py-2 hover:bg-brand-50 transition-colors">
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
                  className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2 text-sm"
                >
                  <span className="truncate max-w-xs text-gray-700">
                    {file.name}
                  </span>
                  {!isView && (
                    <Trash2
                      size={16}
                      className="text-red-500 cursor-pointer hover:text-red-600 flex-shrink-0"
                      onClick={() => removeFile(index)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {!isView && (
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={sending}
            className="bg-brand-500 hover:bg-brand-600"
          >
            {sending ? "Sending..." : mode === "create" ? "Send Email" : "Update"}
          </Button>
        </div>
      )}
    </div>
  );
}
