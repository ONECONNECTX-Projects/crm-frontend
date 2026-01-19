"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";
import { Button } from "@/components/ui/button";
import { getAllActiveLeadStatuses } from "@/app/services/lead-status/lead-status.service";
import { getAllActiveLeadSources } from "@/app/services/lead-source/lead-source.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { updateLead, deleteLead, Lead, Leads } from "@/app/services/lead/lead.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { useError } from "@/app/providers/ErrorProvider";

export default function LeadViewPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useError();

  const [lead, setLead] = useState<Leads | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dropdown options
  const [leadStatuses, setLeadStatuses] = useState<OptionDropDownModel[]>([]);
  const [leadSources, setLeadSources] = useState<OptionDropDownModel[]>([]);
  const [users, setUsers] = useState<OptionDropDownModel[]>([]);

  const [editableFields, setEditableFields] = useState({
    name: false,
    phone: false,
    email: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    lead_owner_id: "",
    lead_status_id: "",
    lead_source_id: "",
  });

  // Parse lead data from URL
  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const parsedLead = JSON.parse(decodeURIComponent(dataParam)) as Leads;
        setLead(parsedLead);
        setFormData({
          name: parsedLead.name || "",
          email: parsedLead.email || "",
          phone: parsedLead.phone || "",
          lead_owner_id: parsedLead.lead_owner_id?.toString() || "",
          lead_status_id: parsedLead.lead_status_id?.toString() || "",
          lead_source_id: parsedLead.lead_source_id?.toString() || "",
        });
      } catch (error) {
        console.error("Failed to parse lead data:", error);
      }
    }
    setLoading(false);
  }, [searchParams]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [statusesRes, sourcesRes, usersRes] = await Promise.all([
          getAllActiveLeadStatuses(),
          getAllActiveLeadSources(),
          getAllActiveUsers(),
        ]);

        setLeadStatuses(statusesRes.data || []);
        setLeadSources(sourcesRes.data || []);
        setUsers(usersRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleEdit = (field: keyof typeof editableFields) => {
    setEditableFields({ ...editableFields, [field]: true });
  };

  const handleSave = async () => {
    if (!lead) return;

    setSaving(true);
    try {
      const leadData: Lead = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        lead_owner_id: parseInt(formData.lead_owner_id) || 0,
        lead_source_id: parseInt(formData.lead_source_id) || 0,
        lead_status_id: parseInt(formData.lead_status_id) || 0,
        priority_id: lead.priority_id || 0,
        lead_value: lead.lead_value || "",
      };

      await updateLead(lead.id, leadData);
      showSuccess("Lead updated successfully");
      setEditableFields({ name: false, phone: false, email: false });
    } catch (error) {
      console.error("Failed to update lead:", error);
      showError("Failed to update lead");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lead) return;

    if (window.confirm(`Are you sure you want to delete "${lead.name}"?`)) {
      try {
        await deleteLead(lead.id);
        showSuccess("Lead deleted successfully");
        router.push("/leads");
      } catch (error) {
        console.error("Failed to delete lead:", error);
        showError("Failed to delete lead");
      }
    }
  };

  const isEditing = Object.values(editableFields).some((val) => val === true);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading...</div>
    );
  }

  if (!lead) {
    return (
      <div className="p-10 text-center text-gray-500">Lead not found.</div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-white rounded-xl shadow-md mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          {lead.name}
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100"
          >
            Close
          </button>

          {isEditing && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          )}

          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Convert
          </button>

          <button
            onClick={handleDelete}
            className="px-5 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lead Owner */}
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

        {/* Lead Source */}
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

        {/* Lead Status */}
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

        {/* Lead Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Name</label>
          {editableFields.name ? (
            <InputField
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
            />
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <p className="text-gray-900 p-3">{formData.name}</p>
              <button
                onClick={() => handleEdit("name")}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
              >
                <Pencil size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Phone Number
          </label>
          {editableFields.phone ? (
            <InputField
              value={formData.phone}
              onChange={(v) => setFormData({ ...formData, phone: v })}
            />
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <p className="text-gray-900 p-3">{formData.phone}</p>
              <button
                onClick={() => handleEdit("phone")}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
              >
                <Pencil size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          {editableFields.email ? (
            <InputField
              type="email"
              value={formData.email}
              onChange={(v) => setFormData({ ...formData, email: v })}
            />
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <p className="text-gray-900 p-3">{formData.email}</p>
              <button
                onClick={() => handleEdit("email")}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
              >
                <Pencil size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
