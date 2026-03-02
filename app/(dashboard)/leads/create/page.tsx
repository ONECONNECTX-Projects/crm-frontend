"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";
import PhoneInput from "react-phone-input-2";
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
import CreateLeadSourceForm from "../../settings/lead-setup/lead-source/create/page";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import CreateLeadStatusForm from "../../settings/lead-setup/lead-status/create/page";
import CreatePriorityForm from "../../settings/priority/create/page";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  //model
  const [openLeadSourceModal, setOpenLeadSourceModal] = useState(false);
  const [openLeadStatusModal, setOpenLeadStatusModal] = useState(false);
  const [openPriorityModal, setOpenPriorityModal] = useState(false);

  // Dropdown options
  const [leadStatuses, setLeadStatuses] = useState<OptionDropDownModel[]>([]);
  const [leadSources, setLeadSources] = useState<OptionDropDownModel[]>([]);
  const [users, setUsers] = useState<OptionDropDownModel[]>([]);
  const [priorities, setPriorities] = useState<OptionDropDownModel[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country_code: "+91",
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
        country_code: data.country_code || "+91",
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
        country_code: "+91",
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.lead_value.trim()) {
      newErrors.lead_value = "Lead value is required";
    } else if (Number(formData.lead_value) < 0) {
      newErrors.lead_value = "Lead value cannot be negative";
    }
    if (!formData.lead_owner_id) {
      newErrors.lead_owner_id = "Lead owner is required";
    }

    if (!formData.lead_status_id) {
      newErrors.lead_status_id = "Lead status is required";
    }

    if (!formData.lead_source_id) {
      newErrors.lead_source_id = "Lead source is required";
    }

    if (!formData.priority_id) {
      newErrors.priority_id = "Priority is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const leadData: Lead = {
        name: formData.name,
        email: formData.email,
        country_code: formData.country_code,
        phone: formData.phone,
        lead_owner_id: parseInt(formData.lead_owner_id),
        lead_source_id: parseInt(formData.lead_source_id),
        lead_status_id: parseInt(formData.lead_status_id),
        priority_id: parseInt(formData.priority_id),
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
    } catch {
      // Error toast is already shown by the global error handler in apiClient
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
              label="Name"
              required
              value={formData.name}
              error={errors.name}
              onChange={(v) => {
                setFormData({ ...formData, name: v });
                setErrors({ ...errors, name: "" });
              }}
              placeholder="Enter Lead Name"
            />
          </div>

          {/* EMAIL */}
          <div>
            <InputField
              type="email"
              label="Email"
              required
              value={formData.email}
              error={errors.email}
              onChange={(v) => {
                setFormData({ ...formData, email: v });
                setErrors({ ...errors, email: "" });
              }}
              placeholder="Enter Email Address"
            />
          </div>

          {/* PHONE WITH COUNTRY CODE */}
          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
              Phone Number
            </label>
            <PhoneInput
              country={"in"}
              value={formData.country_code.replace("+", "") + formData.phone}
              onChange={(value, countryData: { dialCode?: string }) => {
                const dialCode = countryData?.dialCode || "91";
                const phoneNumber = value.slice(dialCode.length);
                setFormData({
                  ...formData,
                  country_code: `+${dialCode}`,
                  phone: phoneNumber,
                });
                setErrors({ ...errors, phone: "" });
              }}
              enableSearch
              searchPlaceholder="Search country..."
              inputStyle={{
                width: "100%",
                height: "44px",
                fontSize: "14px",
                borderRadius: "8px",
                borderColor: errors.phone ? "#ef4444" : "#d1d5db",
              }}
              buttonStyle={{
                borderRadius: "8px 0 0 8px",
                borderColor: errors.phone ? "#ef4444" : "#d1d5db",
              }}
              searchStyle={{
                fontSize: "14px",
              }}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* LEAD VALUE */}
          <div>
            <InputField
              type="number"
              label="Lead Value"
              required={true}
              value={formData.lead_value}
              error={errors.lead_value}
              onChange={(v) => {
                setFormData({ ...formData, lead_value: v });
                setErrors({ ...errors, lead_value: "" });
              }}
              placeholder="Enter Lead Value"
            />
          </div>

          {/* LEAD OWNER */}
          <div>
            <SelectDropdown
              label="Lead Owner"
              value={formData.lead_owner_id}
              error={errors.lead_owner_id}
              required
              onChange={(v) => {
                setFormData({ ...formData, lead_owner_id: v });
                setErrors({ ...errors, lead_owner_id: "" });
              }}
              options={users.map((user) => ({
                label: user.name,
                value: user.id,
              }))}
              placeholder="Select Lead Owner"
            />
          </div>

          {/* PRIORITY */}
          <div>
            <SelectDropdown
              label="Priority"
              value={formData.priority_id}
              error={errors.priority_id}
              required
              onChange={(v) => {
                setFormData({ ...formData, priority_id: v });
                setErrors({ ...errors, priority_id: "" });
              }}
              options={priorities.map((priority) => ({
                label: priority.name,
                value: priority.id,
              }))}
              placeholder="Select Priority"
              onAddClick={() => setOpenPriorityModal(true)}
            />
          </div>

          {/* LEAD STATUS */}
          <div>
            <SelectDropdown
              label="Lead Status"
              value={formData.lead_status_id}
              error={errors.lead_status_id}
              required
              onChange={(v) => {
                setFormData({ ...formData, lead_status_id: v });
                setErrors({ ...errors, lead_status_id: "" });
              }}
              options={leadStatuses.map((status) => ({
                label: status.name,
                value: status.id,
              }))}
              onAddClick={() => setOpenLeadStatusModal(true)}
              placeholder="Select Lead Status"
            />
          </div>

          {/* LEAD SOURCE */}
          <div>
            <SelectDropdown
              label="Lead Source"
              value={formData.lead_source_id}
              error={errors.lead_source_id}
              required
              onChange={(v) => {
                setFormData({ ...formData, lead_source_id: v });
                setErrors({ ...errors, lead_source_id: "" });
              }}
              options={leadSources.map((source) => ({
                label: source.name,
                value: source.id,
              }))}
              onAddClick={() => setOpenLeadSourceModal(true)}
              placeholder="Select Lead Source"
            />
          </div>
        </div>

        {/* Submit Button - only show in create/edit mode */}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full mt-6 bg-brand-500 text-white py-2 rounded-md font-medium hover:bg-brand-600 transition disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : mode === "edit"
              ? "Save Changes"
              : "Create Lead"}
        </Button>
      </form>

      {/* CSV IMPORT BLOCK - only show in create mode */}
      {/* {mode === "create" && (
        <div className="mt-8 border rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-3">Import From CSV</h3>

          <p className="text-red-600 text-center mb-4">
            Please select a CSV file for uploading
          </p>

          <button className="bg-emerald-500 text-white px-4 py-2 rounded-md mb-4 flex mx-auto">
            Demo CSV
          </button>

          <div className="flex items-center justify-center gap-3 border p-3 rounded-md">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            disabled={!csvFile}
            className={`w-full mt-4 py-2 rounded-md font-medium ${
              csvFile
                ? "bg-brand-500 text-white"
                : "bg-brand-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Import From CSV
          </button>
        </div>
      )} */}

      {openLeadSourceModal && (
        <Dialog
          open={openLeadSourceModal}
          onOpenChange={() => setOpenLeadSourceModal(false)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader />
            <CreateLeadSourceForm
              mode={mode}
              onClose={onClose}
              popUp={true}
              onSuccess={async () => {
                setOpenLeadSourceModal(false);

                const res = await getAllActiveLeadSources();
                setLeadSources(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {openLeadStatusModal && (
        <Dialog
          open={openLeadStatusModal}
          onOpenChange={() => setOpenLeadStatusModal(false)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader />
            <CreateLeadStatusForm
              mode={mode}
              onClose={onClose}
              popUp={true}
              onSuccess={async () => {
                setOpenLeadStatusModal(false);

                const res = await getAllActiveLeadStatuses();
                setLeadStatuses(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {openPriorityModal && (
        <Dialog
          open={openPriorityModal}
          onOpenChange={() => setOpenPriorityModal(false)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader />
            <CreatePriorityForm
              mode={mode}
              onClose={onClose}
              popUp={true}
              onSuccess={async () => {
                setOpenPriorityModal(false);

                const res = await getAllActivePriority();
                setPriorities(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
