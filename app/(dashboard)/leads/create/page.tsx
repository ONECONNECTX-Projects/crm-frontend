"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateLeadForm({ mode = "create", data, onClose }: { mode?: "create" | "edit"; data?: any; onClose: () => void }) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  owner: "",
  status: "",
  value: "",
  source: "",
});

useEffect(() => {
  if (mode === "edit" && data) {
    setFormData({
      name: data.name,
      email: data.email,
      phone: data.phone,
      owner: data.owner,
      status: data.status,
      value: data.value,
      source: data.source,
    });
  } else {
    setFormData({
      name: "",
      email: "",
      phone: "",
      owner: "",
      status: "",
      value: "",
      source: "",
    });
  }
}, [mode, data]);
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
          <label className="block mb-1 font-medium">
            <span className="text-red-600">*</span> Name
          </label>
          <input
            type="text"
            placeholder="Jhon"
            className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            placeholder="example@email.com"
            className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="text"
            placeholder="+1 (273) 642-1785"
            className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        {/* LEAD OWNER */}
        <div>
          <label className="block mb-1 font-medium">Lead Owner</label>
          <select className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50">
            <option value="demo">demo</option>
          </select>
        </div>

        {/* LEAD VALUE */}
        <div>
          <label className="block mb-1 font-medium">Lead Value</label>
          <input
            type="text"
            placeholder="Lead Value"
            className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        {/* LEAD STATUS */}
        <div>
          <label className="block mb-1 font-medium">Lead Status</label>
          <select className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50">
            <option>Select contact owner name</option>
          </select>
        </div>

        {/* LEAD SOURCE */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">
            Lead Source{" "}
            <button className="ml-2 text-blue-600 font-bold text-lg">+</button>
          </label>
          <select className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50">
            <option>Select contact owner name</option>
          </select>
        </div>
      </div>

      {/* Create Button */}
      <Button type="submit" className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition">
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
