"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil } from "lucide-react";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";
import { Button } from "@/components/ui/button";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  owner: string;
  status: string;
  source: string;
}

const mockLeads: Lead[] = [
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1555002222",
    owner: "Mr. Admin",
    status: "Working",
    source: "Referral",
  },
];

const leadStatusOptions = [
  { label: "New", value: "New" },
  { label: "Working", value: "Working" },
  { label: "Qualified", value: "Qualified" },
  { label: "Lost", value: "Lost" },
];

const leadSources = [
  { label: "Web", value: "Web" },
  { label: "Referral", value: "Referral" },
  { label: "Cold Call", value: "Cold Call" },
  { label: "Email Campaign", value: "Email Campaign" },
];

const leadOwners = [
  { label: "Mr. Admin", value: "Mr. Admin" },
  { label: "Mr. Salesman", value: "Mr. Salesman" },
];

function LeadViewContent({ lead }: { lead: Lead }) {
  const router = useRouter();

  const [editableFields, setEditableFields] = useState({
    name: false,
    phone: false,
    email: false,
  });
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    owner: lead.owner,
    status: lead.status,
    source: lead.source,
  });

  const handleEdit = (field: keyof typeof editableFields) => {
    setEditableFields({ ...editableFields, [field]: true });
  };

  const handleSave = () => {
    console.log("Saving lead data:", formData);
    setEditableFields({ name: false, phone: false, email: false });
  };

  const isEditing = Object.values(editableFields).some((val) => val === true);

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
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </Button>
          )}

          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Convert
          </button>

          <button className="px-5 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
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
            value={formData.owner}
            onChange={(v) => setFormData({ ...formData, owner: v })}
            options={leadOwners}
          />
        </div>

        {/* Lead Source */}
        <div>
          <SelectDropdown
            label="Lead Source"
            value={formData.source}
            onChange={(v) => setFormData({ ...formData, source: v })}
            options={leadSources}
          />
        </div>

        {/* Lead Status */}
        <div>
          <SelectDropdown
            label="Lead Status"
            value={formData.status}
            onChange={(v) => setFormData({ ...formData, status: v })}
            options={leadStatusOptions}
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

export default function LeadViewPage() {
  const params = useParams();
  const id = Number(params.id);

  const lead = mockLeads.find((l) => l.id === id);

  if (!lead) {
    return (
      <div className="p-10 text-center text-gray-500">Lead not found.</div>
    );
  }

  return <LeadViewContent key={lead.id} lead={lead} />;
}
