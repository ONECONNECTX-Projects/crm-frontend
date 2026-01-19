"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";
import { getAllActiveLeadStatuses } from "@/app/services/lead-status/lead-status.service";
import { getAllActiveLeadSources } from "@/app/services/lead-source/lead-source.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActivePriority } from "@/app/services/priority/priority.service";
import {
  createLead,
  updateLead,
  Lead,
  Leads,
} from "@/app/services/lead/lead.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { useError } from "@/app/providers/ErrorProvider";

interface CreateLeadFormProps {
  mode?: "create" | "edit";
  data?: Leads;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateLeadForm({
  mode = "create",
  data,
  onClose,
  onSuccess,
}: CreateLeadFormProps) {
  const { showSuccess, showError } = useError();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Dropdown options
  const [leadStatuses, setLeadStatuses] = useState<OptionDropDownModel[]>([]);
  const [leadSources, setLeadSources] = useState<OptionDropDownModel[]>([]);
  const [users, setUsers] = useState<OptionDropDownModel[]>([]);
  const [priorities, setPriorities] = useState<OptionDropDownModel[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    lead_owner_id: "",
    lead_status_id: "",
    lead_value: "",
    lead_source_id: "",
    priority_id: "",
  });

  // Set form data when editing
  useEffect(() => {
    if (mode === "edit" && data) {
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        lead_owner_id: data.lead_owner_id?.toString() || "",
        lead_status_id: data.lead_status_id?.toString() || "",
        lead_value: data.lead_value || "",
        lead_source_id: data.lead_source_id?.toString() || "",
        priority_id: data.priority_id?.toString() || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        lead_owner_id: "",
        lead_status_id: "",
        lead_value: "",
        lead_source_id: "",
        priority_id: "",
      });
    }
  }, [mode, data]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoading(true);
      try {
        const [statusesRes, sourcesRes, usersRes, prioritiesRes] =
          await Promise.all([
            getAllActiveLeadStatuses(),
            getAllActiveLeadSources(),
            getAllActiveUsers(),
            getAllActivePriority(),
          ]);

        setLeadStatuses(statusesRes.data || []);
        setLeadSources(sourcesRes.data || []);
        setUsers(usersRes.data || []);
        setPriorities(prioritiesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError("Name is required");
      return;
    }

    setSubmitting(true);
    try {
      const leadData: Lead = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        lead_owner_id: parseInt(formData.lead_owner_id) || 0,
        lead_source_id: parseInt(formData.lead_source_id) || 0,
        lead_status_id: parseInt(formData.lead_status_id) || 0,
        priority_id: parseInt(formData.priority_id) || 0,
        lead_value: formData.lead_value,
      };

      if (mode === "edit" && data?.id) {
        await updateLead(data.id, leadData);
        showSuccess("Lead updated successfully");
      } else {
        await createLead(leadData);
        showSuccess("Lead created successfully");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to save lead:", error);
      showError(
        mode === "edit" ? "Failed to update lead" : "Failed to create lead"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getTitle = () => {
    return mode === "edit" ? "Edit Lead" : "Create Lead";
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{getTitle()}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* NAME */}
          <div>
            <InputField
              type="text"
              label="Name *"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
              placeholder="Enter Lead Name"
            />
          </div>

          {/* EMAIL */}
          <div>
            <InputField
              type="email"
              label="Email"
              value={formData.email}
              onChange={(v) => setFormData({ ...formData, email: v })}
              placeholder="Enter Email Address"
            />
          </div>

          {/* PHONE */}
          <div>
            <InputField
              type="text"
              label="Phone Number"
              value={formData.phone}
              onChange={(v) => setFormData({ ...formData, phone: v })}
              placeholder="Enter Phone Number"
            />
          </div>

          {/* LEAD OWNER */}
          <div>
            <SelectDropdown
              label="Lead Owner"
              value={formData.lead_owner_id}
              onChange={(v) => setFormData({ ...formData, lead_owner_id: v })}
              options={users.map((user) => ({
                label: user.name,
                value: user.id,
              }))}
              placeholder="Select Lead Owner"
            />
          </div>

          {/* LEAD VALUE */}
          <div>
            <InputField
              type="text"
              label="Lead Value"
              value={formData.lead_value}
              onChange={(v) => setFormData({ ...formData, lead_value: v })}
              placeholder="Enter Lead Value"
            />
          </div>

          {/* PRIORITY */}
          <div>
            <SelectDropdown
              label="Priority"
              value={formData.priority_id}
              onChange={(v) => setFormData({ ...formData, priority_id: v })}
              options={priorities.map((priority) => ({
                label: priority.name,
                value: priority.id,
              }))}
              placeholder="Select Priority"
            />
          </div>

          {/* LEAD STATUS */}
          <div>
            <SelectDropdown
              label="Lead Status"
              value={formData.lead_status_id}
              onChange={(v) => setFormData({ ...formData, lead_status_id: v })}
              options={leadStatuses.map((status) => ({
                label: status.name,
                value: status.id,
              }))}
              placeholder="Select Lead Status"
            />
          </div>

          {/* LEAD SOURCE */}
          <div>
            <SelectDropdown
              label="Lead Source"
              value={formData.lead_source_id}
              onChange={(v) => setFormData({ ...formData, lead_source_id: v })}
              options={leadSources.map((source) => ({
                label: source.name,
                value: source.id,
              }))}
              placeholder="Select Lead Source"
            />
          </div>
        </div>

        {/* Submit Button - only show in create/edit mode */}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : mode === "edit"
              ? "Save Changes"
              : "Create Lead"}
        </Button>
      </form>

      {/* CSV IMPORT BLOCK - only show in create mode */}
      {mode === "create" && (
        <div className="mt-8 border rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-3">Import From CSV</h3>

          <p className="text-red-600 text-center mb-4">
            Please select a CSV file for uploading
          </p>

          <button className="bg-emerald-500 text-white px-4 py-2 rounded-md mb-4 flex mx-auto">
            Demo CSV
          </button>

          {/* File Input */}
          <div className="flex items-center justify-center gap-3 border p-3 rounded-md">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* Import button */}
          <button
            disabled={!csvFile}
            className={`w-full mt-4 py-2 rounded-md font-medium ${
              csvFile
                ? "bg-blue-600 text-white"
                : "bg-blue-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Import From CSV
          </button>
        </div>
      )}
    </div>
  );
}
