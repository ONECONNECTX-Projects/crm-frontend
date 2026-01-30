"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, XIcon, FileIcon, Trash2 } from "lucide-react";
import {
  createAttachment,
  AttachmentPayload,
} from "@/app/services/attachment/attachement.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveCompany } from "@/app/services/company/company.service";
import { getAllActiveContacts } from "@/app/services/contact/contact.service";
import { getAllActiveOpportunity } from "@/app/services/opportunity/opportunity.service";
import { getAllActiveQuotes } from "@/app/services/quote/quote.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { useError } from "@/app/providers/ErrorProvider";
import SelectDropdown from "@/app/common/dropdown";

interface CreateAttachmentFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateAttachmentForm({
  onClose,
  onSuccess,
}: CreateAttachmentFormProps) {
  const { showSuccess, showError } = useError();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [ownerId, setOwnerId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [contactId, setContactId] = useState("");
  const [opportunityId, setOpportunityId] = useState("");
  const [quoteId, setQuoteId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Dropdown data
  const [owners, setOwners] = useState<OptionDropDownModel[]>([]);
  const [companies, setCompanies] = useState<OptionDropDownModel[]>([]);
  const [contacts, setContacts] = useState<OptionDropDownModel[]>([]);
  const [opportunities, setOpportunities] = useState<OptionDropDownModel[]>([]);
  const [quotes, setQuotes] = useState<OptionDropDownModel[]>([]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [
          ownersRes,
          companiesRes,
          contactsRes,
          opportunitiesRes,
          quotesRes,
        ] = await Promise.all([
          getAllActiveUsers(),
          getAllActiveCompany(),
          getAllActiveContacts(),
          getAllActiveOpportunity(),
          getAllActiveQuotes(),
        ]);

        setOwners(ownersRes.data || []);
        setCompanies(companiesRes.data || []);
        setContacts(contactsRes.data || []);
        setOpportunities(opportunitiesRes.data || []);
        setQuotes(quotesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Convert OptionDropDownModel to SelectDropdown options format
  const toOptions = (data: OptionDropDownModel[]) =>
    data.map((item) => ({ label: item.name, value: item.id }));

  // File handling
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Form submission
  const handleSubmit = async () => {
    if (!file) {
      showError("Please select a file to upload");
      return;
    }

    setLoading(true);
    try {
      const payload: AttachmentPayload = {
        owner_id: ownerId || "",
        company_id: companyId || "",
        contact_id: contactId || "",
        opportunity_id: opportunityId || "",
        quote_id: quoteId || "",
        attachment: file,
      };

      await createAttachment(payload);
      showSuccess("Attachment uploaded successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create attachment:", error);
      showError("Failed to upload attachment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Upload Attachment
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* File Upload Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            <span className="text-red-500 mr-1">*</span>Attachment
          </label>

          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
                isDragging
                  ? "border-brand-500 bg-brand-50"
                  : "border-gray-300 bg-gray-50 hover:bg-brand-50 hover:border-brand-400"
              }`}
            >
              <div className="bg-brand-100 p-3 rounded-full mb-3">
                <Upload className="w-6 h-6 text-brand-500" />
              </div>
              <p className="text-sm text-gray-600 text-center">
                <span className="text-brand-500 font-medium">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (max 10MB)
              </p>
            </div>
          ) : (
            <div className="border border-brand-200 bg-brand-50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-brand-100 p-2 rounded-lg">
                  <FileIcon className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
          />
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-5">
          {/* Attachment Owner */}
          <SelectDropdown
            label="Attachment Owner"
            value={ownerId}
            options={toOptions(owners)}
            placeholder="Select owner"
            onChange={(value) => setOwnerId(value)}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Company */}
            <SelectDropdown
              label="Company"
              value={companyId}
              options={toOptions(companies)}
              placeholder="Select company"
              onChange={(value) => setCompanyId(value)}
              onAddClick={() => console.log("Add company")}
            />

            {/* Contact */}
            <SelectDropdown
              label="Contact"
              value={contactId}
              options={toOptions(contacts)}
              placeholder="Select contact"
              onChange={(value) => setContactId(value)}
              onAddClick={() => console.log("Add contact")}
            />

            {/* Opportunity */}
            <SelectDropdown
              label="Opportunity"
              value={opportunityId}
              options={toOptions(opportunities)}
              placeholder="Select opportunity"
              onChange={(value) => setOpportunityId(value)}
              onAddClick={() => console.log("Add opportunity")}
            />

            {/* Quote */}
            <SelectDropdown
              label="Quote"
              value={quoteId}
              options={toOptions(quotes)}
              placeholder="Select quote"
              onChange={(value) => setQuoteId(value)}
              onAddClick={() => console.log("Add quote")}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload
            </>
          )}
        </button>
      </div>
    </div>
  );
}
