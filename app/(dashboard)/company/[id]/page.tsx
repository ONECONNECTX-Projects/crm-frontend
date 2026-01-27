"use client";

import { useEffect, useState } from "react";
import { Pencil, Loader2, MapPin, ArrowLeft } from "lucide-react";
import SelectDropdown from "@/app/common/dropdown";
import InputField from "@/app/common/InputFeild";
import { Button } from "@/components/ui/button";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { useError } from "@/app/providers/ErrorProvider";
import { useParams, useRouter } from "next/navigation";
import {
  Company,
  getCompanyById,
  updateCompany,
  deleteCompany,
  CompanyPayload,
} from "@/app/services/company/company.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveIndustry } from "@/app/services/Industry/industry.service";
import { getAllActiveCompanyType } from "@/app/services/company-type/company-type.service";

type Tab =
  | "info"
  | "opportunities"
  | "tasks"
  | "contacts"
  | "notes"
  | "attachments"
  | "emails"
  | "quotes";

export default function CompanyViewPage() {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useError();
  const companyId = Number(params.id);

  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dropdown Data
  const [owners, setOwners] = useState<OptionDropDownModel[]>([]);
  const [industries, setIndustries] = useState<OptionDropDownModel[]>([]);
  const [companyTypes, setCompanyType] = useState<OptionDropDownModel[]>([]);

  // Form States
  const [formData, setFormData] = useState<any>(null);
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (!companyId) return;
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await getCompanyById(companyId);
        if (res.data) {
          setFormData(res.data);
        }
      } catch (error) {
        showError("Failed to fetch company details");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [companyId, showError]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [ownersRes, industriesRes, companyTypeRes] = await Promise.all([
          getAllActiveUsers(),
          getAllActiveIndustry(),
          getAllActiveCompanyType(),
        ]);
        setOwners(ownersRes.data || []);
        setIndustries(industriesRes.data || []);
        setCompanyType(companyTypeRes.data || []);
      } catch (error) {
        console.error("Dropdown fetch failed", error);
      }
    };
    fetchDropdowns();
  }, []);

  const handleEdit = (field: string) => {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  const markEdited = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleAddressChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
    setEditableFields((prev) => ({ ...prev, address: true }));
  };

  const handleSave = async () => {
    if (!formData) return;
    setSaving(true);
    try {
      const payload: CompanyPayload = {
        company: {
          name: formData.name,
          owner_id: formData.owner_id.toString(),
          industry_id: formData.industry_id.toString(),
          company_type_id: formData.company_type_id.toString(),
          company_size: formData.company_size.toString(),
          annual_revenue: formData.annual_revenue.toString(),
          phone: formData.phone,
          email: formData.email,
          website: formData.website || "",
          linkedin: formData.linkedin || "",
          twitter: formData.twitter || "",
          instagram: formData.instagram || "",
          facebook: formData.facebook || "",
        },
        address: formData.address,
      };

      await updateCompany(companyId, payload);
      showSuccess("Company updated successfully");
      setEditableFields({});
    } catch (error) {
      showError("Failed to update company");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await deleteCompany(companyId);
        showSuccess("Company deleted successfully");
        router.push("/companies");
      } catch (error) {
        showError("Failed to delete company");
      }
    }
  };

  const isEditing = Object.values(editableFields).some((val) => val === true);

  if (loading)
    return (
      <div className="p-10 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );
  if (!formData)
    return <div className="p-10 text-center">Company not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Save/Close Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-full transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">{formData.name}</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-white border rounded-lg text-sm font-medium"
          >
            Close
          </button>
          {isEditing && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-md px-4 mb-6 border overflow-x-auto">
        <div className="flex gap-6 text-sm font-medium whitespace-nowrap">
          {[
            "info",
            "opportunities",
            "tasks",
            "contacts",
            "notes",
            "attachments",
            "emails",
            "quotes",
          ].map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab as Tab)}
            />
          ))}
        </div>
      </div>

      {activeTab === "info" && (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Essential Info */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Core Information
              </h3>
              <div className="space-y-4">
                <SelectDropdown
                  label="Company Owner"
                  value={formData.owner_id}
                  options={owners.map((o) => ({ label: o.name, value: o.id }))}
                  onChange={(v: number | string) => markEdited("owner_id", v)}
                />

                <EditableFieldItem
                  label="Company Name"
                  value={formData.name}
                  isEditing={editableFields.name}
                  onEdit={() => handleEdit("name")}
                  onChange={(v: number | string) => markEdited("name", v)}
                />

                <EditableFieldItem
                  label="Email Address"
                  value={formData.email}
                  isEditing={editableFields.email}
                  onEdit={() => handleEdit("email")}
                  onChange={(v: number | string) => markEdited("email", v)}
                />

                <EditableFieldItem
                  label="Phone Number"
                  value={formData.phone}
                  isEditing={editableFields.phone}
                  onEdit={() => handleEdit("phone")}
                  onChange={(v: number | string) => markEdited("phone", v)}
                />

                <EditableFieldItem
                  label="Website"
                  value={formData.website}
                  isEditing={editableFields.website}
                  onEdit={() => handleEdit("website")}
                  onChange={(v: number | string) => markEdited("website", v)}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Details & Address */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Section title="Business Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectDropdown
                  label="Company Type"
                  value={formData.company_type_id}
                  options={companyTypes.map((t) => ({
                    label: t.name,
                    value: t.id,
                  }))}
                  onChange={(v) => markEdited("company_type_id", v)}
                />
                <SelectDropdown
                  label="Industry"
                  value={formData.industry_id}
                  options={industries.map((i) => ({
                    label: i.name,
                    value: i.id,
                  }))}
                  onChange={(v) => markEdited("industry_id", v)}
                />
                <EditableFieldItem
                  label="Company Size"
                  value={formData.company_size}
                  isEditing={editableFields.company_size}
                  onEdit={() => handleEdit("company_size")}
                  onChange={(v: number | string) =>
                    markEdited("company_size", v)
                  }
                />
                <EditableFieldItem
                  label="Annual Revenue"
                  value={formData.annual_revenue}
                  isEditing={editableFields.annual_revenue}
                  onEdit={() => handleEdit("annual_revenue")}
                  onChange={(v: number | string) =>
                    markEdited("annual_revenue", v)
                  }
                />
              </div>
            </Section>

            <Section title="Address Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Billing */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <MapPin size={14} /> Billing
                  </h4>
                  <InputField
                    label="Street"
                    value={formData.address.billing_street}
                    onChange={(v) => handleAddressChange("billing_street", v)}
                  />
                  <InputField
                    label="City"
                    value={formData.address.billing_city}
                    onChange={(v) => handleAddressChange("billing_city", v)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="State"
                      value={formData.address.billing_state}
                      onChange={(v) => handleAddressChange("billing_state", v)}
                    />
                    <InputField
                      label="ZIP"
                      value={formData.address.billing_zip}
                      onChange={(v) => handleAddressChange("billing_zip", v)}
                    />
                  </div>
                </div>

                {/* Shipping */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <MapPin size={14} /> Shipping
                  </h4>
                  <InputField
                    label="Street"
                    value={formData.address.shipping_street}
                    onChange={(v) => handleAddressChange("shipping_street", v)}
                  />
                  <InputField
                    label="City"
                    value={formData.address.shipping_city}
                    onChange={(v) => handleAddressChange("shipping_city", v)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="State"
                      value={formData.address.shipping_state}
                      onChange={(v) => handleAddressChange("shipping_state", v)}
                    />
                    <InputField
                      label="ZIP"
                      value={formData.address.shipping_zip}
                      onChange={(v) => handleAddressChange("shipping_zip", v)}
                    />
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

function EditableFieldItem({ label, value, isEditing, onEdit, onChange }: any) {
  return (
    <div className="group">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      {isEditing ? (
        <InputField value={value} onChange={onChange} />
      ) : (
        <div
          className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition cursor-text"
          onClick={onEdit}
        >
          <span className="text-sm text-gray-900">{value || "—"}</span>
          <Pencil
            size={14}
            className="text-gray-300 group-hover:text-gray-500"
          />
        </div>
      )}
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-4 border-b-2 transition text-sm font-semibold capitalize
        ${active ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
    >
      {label}
    </button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h3 className="text-sm font-bold text-gray-800 mb-5 pb-2 border-b">
        {title}
      </h3>
      {children}
    </div>
  );
}
