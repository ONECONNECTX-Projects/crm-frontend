"use client";

import { useState } from "react";
import {
  ClipboardList,
  StickyNote,
  Paperclip,
  Mail,
  FileText,
  Plus,
  Pencil,
} from "lucide-react";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";
import { Button } from "@/components/ui/button";

const stages = [
  "Prospect",
  "Qualification",
  "Needs Assessment",
  "Proposal/Quote",
  "Negotiation/Review",
  "Closed Won",
  "Closed Lost",
];

const tabs = [
  { key: "tasks", label: "Tasks", icon: ClipboardList },
  { key: "notes", label: "Notes", icon: StickyNote },
  { key: "attachments", label: "Attachments", icon: Paperclip },
  { key: "emails", label: "Emails", icon: Mail },
  { key: "quotes", label: "Quotes", icon: FileText },
];

const opportunityOwners = [
  { label: "John Doe", value: "John Doe" },
  { label: "Jane Smith", value: "Jane Smith" },
];

const contacts = [
  { label: "Select Contact", value: "" },
  { label: "Contact 1", value: "Contact 1" },
  { label: "Contact 2", value: "Contact 2" },
];

const companies = [
  { label: "Select Company", value: "" },
  { label: "Company A", value: "Company A" },
  { label: "Company B", value: "Company B" },
];

export default function OpportunityViewPage() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [activeStage, setActiveStage] = useState("Closed Lost");

  const initialData = {
    owner: "John Doe",
    name: "d",
    contact: "",
    company: "",
    amount: "0",
  };

  const [editableFields, setEditableFields] = useState({
    name: false,
    amount: false,
  });

  const [formData, setFormData] = useState(initialData);
  const [originalData] = useState(initialData);

  const handleEdit = (field: keyof typeof editableFields) => {
    setEditableFields({ ...editableFields, [field]: true });
  };

  const handleSave = () => {
    console.log("Saving opportunity data:", formData);
    setEditableFields({ name: false, amount: false });
  };

  const hasChanges =
    JSON.stringify(formData) !== JSON.stringify(originalData);
  const isEditing =
    Object.values(editableFields).some((val) => val === true) || hasChanges;

  return (
    <div className="p-6 space-y-6 bg-white rounded-xl min-h-screen">
      {/* Header Dates */}
      <div className="flex justify-between text-sm font-medium">
        <span>
          <strong>START:</strong> December 17th 2025
        </span>
        <span>
          <strong>CLOSING:</strong> December 17th 2025
        </span>
      </div>

      {/* Pipeline Stages */}
      <div className="flex flex-wrap gap-2">
        {stages.map((stage) => (
          <button
            key={stage}
            onClick={() => setActiveStage(stage)}
            className={`px-3 py-1 rounded text-sm font-medium
              ${
                activeStage === stage
                  ? "bg-brand-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
          >
            {stage}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT PANEL */}
        <div className="col-span-4 bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h2 className="text-lg font-semibold">{formData.name}</h2>
              <p className="text-green-600 text-xl font-bold">
                ${formData.amount}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {isEditing && (
                <Button
                  onClick={handleSave}
                  className="px-4 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  Save
                </Button>
              )}
              <button className="border border-red-500 text-red-500 px-3 py-1 rounded-md text-sm hover:bg-red-50">
                Delete Opportunity
              </button>
            </div>
          </div>

          {/* Opportunity Owner */}
          <div>
            <SelectDropdown
              label="Opportunity Owner"
              value={formData.owner}
              onChange={(v) => setFormData({ ...formData, owner: v })}
              options={opportunityOwners}
            />
          </div>

          {/* Opportunity Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Opportunity Name
            </label>
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

          {/* Contact */}
          <div>
            <SelectDropdown
              label="Contact"
              value={formData.contact}
              onChange={(v) => setFormData({ ...formData, contact: v })}
              options={contacts}
            />
          </div>

          {/* Company */}
          <div>
            <SelectDropdown
              label="Company"
              value={formData.company}
              onChange={(v) => setFormData({ ...formData, company: v })}
              options={companies}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Amount ($)
            </label>
            {editableFields.amount ? (
              <InputField
                type="number"
                value={formData.amount}
                onChange={(v) => setFormData({ ...formData, amount: v })}
              />
            ) : (
              <div className="mt-2 flex items-center gap-2">
                <p className="text-gray-900 p-3">
                  {formData.amount || "—"}
                </p>
                <button
                  onClick={() => handleEdit("amount")}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  <Pencil size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-8 space-y-4">
          {/* Tabs */}
          <div className="flex gap-6 border-b">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium
                  ${
                    activeTab === key
                      ? "border-b-2 border-brand-500 text-brand-500"
                      : "text-gray-600"
                  }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "tasks" && <TasksTab />}
          {activeTab === "notes" && <EmptyTab label="Notes" />}
          {activeTab === "attachments" && <EmptyTab label="Attachments" />}
          {activeTab === "emails" && <EmptyTab label="Emails" />}
          {activeTab === "quotes" && <EmptyTab label="Quotes" />}
        </div>
      </div>
    </div>
  );
}

/* -------------------- SUB COMPONENTS -------------------- */

function TasksTab() {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          Tasks <Plus size={16} className="text-brand-500" />
        </h3>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Name</th>
            <th>Assignee</th>
            <th>Type</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
      </table>

      <div className="text-center text-gray-400 py-12">
        <div className="text-4xl mb-2">🗄️</div>
        Empty
      </div>
    </div>
  );
}

function EmptyTab({ label }: { label: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-10 text-center text-gray-400">
      No {label} found
    </div>
  );
}
