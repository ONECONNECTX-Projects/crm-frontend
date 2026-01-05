"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";

interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  owner?: string;
  status?: string;
  value?: string;
  source?: string;
}

export default function CreateLeadForm({
  mode = "create",
  data,
  onClose,
}: {
  mode?: "create" | "edit";
  data?: LeadData;
  onClose: () => void;
}) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: mode === "edit" && data ? data.name : "",
    email: mode === "edit" && data ? data.email : "",
    phone: mode === "edit" && data ? data.phone : "",
    owner: mode === "edit" && data ? data.owner : "",
    status: mode === "edit" && data ? data.status : "",
    value: mode === "edit" && data ? data.value : "",
    source: mode === "edit" && data ? data.source : "",
  });
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {mode === "edit" ? "Edit Lead" : "Create Lead"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* FORM */}
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
            value={formData.owner}
            onChange={(v) => setFormData({ ...formData, owner: v })}
            options={[
              { label: "Demo", value: "demo" },
              { label: "Admin", value: "admin" },
            ]}
            placeholder="Select Lead Owner"
          />
        </div>

        {/* LEAD VALUE */}
        <div>
          <SelectDropdown
            label="Lead Value"
            value={formData.value}
            onChange={(v) => setFormData({ ...formData, value: v })}
            options={[
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ]}
            placeholder="Select Lead Value"
          />
        </div>

        {/* LEAD STATUS */}
        <div>
          <SelectDropdown
            label="Lead Status"
            value={formData.status}
            onChange={(v) => setFormData({ ...formData, status: v })}
            options={[
              { label: "New", value: "new" },
              { label: "Contacted", value: "contacted" },
              { label: "Qualified", value: "qualified" },
              { label: "Unqualified", value: "unqualified" },
            ]}
            placeholder="Select Lead Status"
          />
        </div>

        {/* LEAD SOURCE */}
        <div className="md:col-span-2">
          <SelectDropdown
            label="Lead Source"
            value={formData.source}
            onChange={(v) => setFormData({ ...formData, source: v })}
            options={[
              { label: "Website", value: "website" },
              { label: "Referral", value: "referral" },
              { label: "Social Media", value: "social_media" },
            ]}
            placeholder="Select Lead Source"
          />
        </div>
      </div>

      {/* Create Button */}
      <Button
        type="submit"
        className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
      >
        {mode === "edit" ? "Save Changes" : "Create Lead"}
      </Button>

      {/* CSV IMPORT BLOCK */}
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
    </div>
  );
}
