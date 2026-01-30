"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";
import { useError } from "@/app/providers/ErrorProvider";
import SlideOver from "@/app/common/slideOver";

// Services & Models
import {
  createNote,
  Notes,
  NotesPayload,
  updateNote,
} from "@/app/services/notes/notes.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveContacts } from "@/app/services/contact/contact.service";
import { getAllActiveCompany } from "@/app/services/company/company.service";

// Nested Forms for "Add New" functionality

import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { getAllActiveOpportunity } from "@/app/services/opportunity/opportunity.service";
import { getAllActiveQuotes } from "@/app/services/quote/quote.service";
import CreateCompanyForm from "@/app/(dashboard)/company/create/page";
import CreateContactForm from "@/app/(dashboard)/contact/create/page";

interface CreateNoteProps {
  mode: "create" | "edit";
  data?: Notes; // The row data passed from the table
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateNote({
  mode,
  data,
  onClose,
  onSuccess,
}: CreateNoteProps) {
  const { showSuccess, showError } = useError();
  const [submitting, setSubmitting] = useState(false);

  // Dropdown Data State
  const [owners, setOwners] = useState<OptionDropDownModel[]>([]);
  const [companies, setCompanies] = useState<OptionDropDownModel[]>([]);
  const [contacts, setContacts] = useState<OptionDropDownModel[]>([]);
  const [opportunities, setOpportunities] = useState<OptionDropDownModel[]>([]);
  const [quotes, setQuotes] = useState<OptionDropDownModel[]>([]);

  // Modal/SlideOver Toggle State for "Add New"
  const [openCompanies, setOpenCompanies] = useState(false);
  const [openContacts, setOpenContacts] = useState(false);

  // Form State
  const [formData, setFormData] = useState<NotesPayload>({
    title: "",
    owner_id: "",
    company_id: "",
    contact_id: "",
    opportunity_id: "",
    quote_id: "",
    description: "",
  });

  // 1. Fetch Lookups
  const fetchDropdowns = async () => {
    try {
      const [u, comp, cont, opp, quo] = await Promise.all([
        getAllActiveUsers(),
        getAllActiveCompany(),
        getAllActiveContacts(),
        getAllActiveOpportunity(),
        getAllActiveQuotes(),
      ]);
      setOwners(u.data || []);
      setCompanies(comp.data || []);
      setContacts(cont.data || []);
      setOpportunities(opp.data || []);
      setQuotes(quo.data || []);
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  // 2. Load Edit Data
  useEffect(() => {
    if (mode === "edit" && data) {
      setFormData({
        title: data.title || "",
        owner_id: data.owner_id ? String(data.owner_id) : "",
        company_id: data.company_id ? String(data.company_id) : "",
        contact_id: data.contact_id ? String(data.contact_id) : "",
        opportunity_id: data.opportunity_id ? String(data.opportunity_id) : "",
        quote_id: data.quote_id ? String(data.quote_id) : "",
        description: data.description || "",
      });
    }
  }, [mode, data]);

  // 3. Submit Handler
  const handleSubmit = async () => {
    if (!formData.title.trim()) return showError("Title is required");
    if (!formData.owner_id) return showError("Owner is required");

    setSubmitting(true);
    try {
      // Format payload to ensure IDs are numbers or null
      const payload = {
        ...formData,
        owner_id: formData.owner_id,
        company_id: formData.company_id,
        contact_id: formData.contact_id,
        opportunity_id: formData.opportunity_id,
        quote_id: formData.quote_id,
      };

      if (mode === "edit" && data?.id) {
        await updateNote(data.id, payload);
        showSuccess("Note updated successfully");
      } else {
        await createNote(payload);
        showSuccess("Note created successfully");
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      showError(error?.response?.data?.message || "Failed to save note");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit Note" : "Create Note"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <InputField
            label="Title *"
            value={formData.title}
            onChange={(v) => setFormData({ ...formData, title: v })}
            placeholder="Enter Note Title"
          />

          <SelectDropdown
            label="Note Owner *"
            value={formData.owner_id}
            onChange={(v) => setFormData({ ...formData, owner_id: v })}
            options={owners.map((item: OptionDropDownModel) => ({
              label: item.name,
              value: item.id,
            }))}
            placeholder="Select Owner"
          />

          <SelectDropdown
            label="Company"
            value={formData.company_id}
            onChange={(v) => setFormData({ ...formData, company_id: v })}
            options={companies.map((item: OptionDropDownModel) => ({
              label: item.name,
              value: item.id,
            }))}
            onAddClick={() => setOpenCompanies(true)}
            placeholder="Select Company"
          />

          <SelectDropdown
            label="Contact"
            value={formData.contact_id}
            onChange={(v) => setFormData({ ...formData, contact_id: v })}
            options={contacts.map((item: OptionDropDownModel) => ({
              label: item.name, // Ensure your API returns 'name' as we fixed earlier
              value: item.id,
            }))}
            onAddClick={() => setOpenContacts(true)}
            placeholder="Select Contact"
          />

          <SelectDropdown
            label="Opportunity"
            value={formData.opportunity_id}
            onChange={(v) => setFormData({ ...formData, opportunity_id: v })}
            options={opportunities.map((item: OptionDropDownModel) => ({
              label: item.name,
              value: item.id,
            }))}
            placeholder="Select Opportunity"
          />

          <SelectDropdown
            label="Quote"
            value={formData.quote_id}
            onChange={(v) => setFormData({ ...formData, quote_id: v })}
            options={quotes.map((item: OptionDropDownModel) => ({
              label: item.name,
              value: item.id,
            }))}
            placeholder="Select Quote"
          />

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full mt-1 border rounded-md p-3 min-h-[120px] text-sm focus:ring-1 focus:ring-brand-500 outline-none"
              placeholder="Enter note details..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-brand-500 hover:bg-brand-600"
        >
          {submitting
            ? "Saving..."
            : mode === "edit"
              ? "Update Note"
              : "Create Note"}
        </Button>
      </div>

      {/* Nested Modals for "Add New" */}
      {openCompanies && (
        <SlideOver
          open={openCompanies}
          onClose={() => setOpenCompanies(false)}
          width="sm:w-[800px]"
        >
          <CreateCompanyForm
            mode="create"
            onClose={() => setOpenCompanies(false)}
            onSuccess={async () => {
              setOpenCompanies(false);
              const res = await getAllActiveCompany();
              setCompanies(res.data || []);
            }}
          />
        </SlideOver>
      )}

      {openContacts && (
        <SlideOver
          open={openContacts}
          onClose={() => setOpenContacts(false)}
          width="sm:w-[800px]"
        >
          <CreateContactForm
            mode="create"
            onClose={() => setOpenContacts(false)}
            onSuccess={async () => {
              setOpenContacts(false);
              const res = await getAllActiveContacts();
              setContacts(res.data || []);
            }}
          />
        </SlideOver>
      )}
    </div>
  );
}
