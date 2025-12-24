"use client";

import { useState } from "react";
import {
  ClipboardList,
  StickyNote,
  Paperclip,
  Mail,
  FileText,
  Plus,
} from "lucide-react";

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

export default function OpportunityViewPage() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [activeStage, setActiveStage] = useState("Closed Lost");

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
                  ? "bg-blue-600 text-white"
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
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">d</h2>
              <p className="text-green-600 text-xl font-bold">$0</p>
            </div>
            <button className="border border-red-500 text-red-500 px-3 py-1 rounded-md text-sm">
              Delete Opportunity
            </button>
          </div>

          <Field label="Opportunity Owner">
            <select className="input">
              <option>John Doe</option>
            </select>
          </Field>

          <Field label="Opportunity Name">
            <div className="flex justify-between items-center">
              <span>d</span>
              ✏️
            </div>
          </Field>

          <Field label="Contact">
            <select className="input">
              <option>Select Contact</option>
            </select>
          </Field>

          <Field label="Company">
            <select className="input">
              <option>Select Company</option>
            </select>
          </Field>

          <Field label="Amount ($)">
            <div className="flex justify-between items-center">
              <span>—</span>
              ✏️
            </div>
          </Field>
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
                      ? "border-b-2 border-blue-600 text-blue-600"
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function TasksTab() {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          Tasks <Plus size={16} className="text-blue-600" />
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
