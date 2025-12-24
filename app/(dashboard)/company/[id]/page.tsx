"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<Tab>("info");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Title */}
      <h1 className="text-lg font-semibold mb-4">Company Details</h1>

      {/* Top Tabs */}
      <div className="bg-white rounded-md px-4 mb-6 border">
        <div className="flex gap-6 text-sm font-medium">
          <TabButton
            label="Company Information"
            active={activeTab === "info"}
            onClick={() => setActiveTab("info")}
          />

          <TabButton
            label="Opportunities"
            active={activeTab === "opportunities"}
            onClick={() => setActiveTab("opportunities")}
          />

          <TabButton
            label="Tasks"
            active={activeTab === "tasks"}
            onClick={() => setActiveTab("tasks")}
          />

          <TabButton
            label="Contacts"
            active={activeTab === "contacts"}
            onClick={() => setActiveTab("contacts")}
          />

          <TabButton
            label="Notes"
            active={activeTab === "notes"}
            onClick={() => setActiveTab("notes")}
          />

          <TabButton
            label="Attachments"
            active={activeTab === "attachments"}
            onClick={() => setActiveTab("attachments")}
          />

          <TabButton
            label="Emails"
            active={activeTab === "emails"}
            onClick={() => setActiveTab("emails")}
          />

          <TabButton
            label="Quotes"
            active={activeTab === "quotes"}
            onClick={() => setActiveTab("quotes")}
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === "info" && (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Summary */}
          <div className="col-span-4 bg-white rounded-md border p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-sm">GreenFields Agro</h2>
                <a href="#" className="text-xs text-blue-600 hover:underline">
                  https://greenfields.example
                </a>
                <p className="text-xs text-gray-500 mt-1">5550003003</p>
              </div>

              <button className="text-red-600 border border-red-500 px-3 py-1 rounded text-xs">
                Delete Company
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <InfoRow label="Company Owner" value="Mrs. Manager" />
              <EditableRow label="Company Name" value="GreenFields Agro" />
              <EditableRow
                label="Website"
                value="https://greenfields.example"
              />
              <EditableRow label="Email" value="hello@greenfields.example" />
              <EditableRow label="Phone Number" value="5550003003" />
            </div>
          </div>

          {/* Right Details */}
          <div className="col-span-8 space-y-6">
            {/* Company Details */}
            <Section title="Company Details">
              <div className="grid grid-cols-2 gap-6">
                <Field label="Company Type" value="Government" />
                <Field label="Industry" value="Biotechnology" />
                <Field label="Company Size" value="80" />
                <Field label="Annual Revenue" value="3200000" />
              </div>
            </Section>

            {/* Billing Address */}
            <Section title="Billing Address">
              <div className="grid grid-cols-2 gap-6">
                <Field label="Street Address" value="42 Harvest Rd" />
                <Field label="City" value="Lahore" />
                <Field label="ZIP Code" value="54000" />
                <Field label="State" value="Punjab" />
                <Field label="Country" value="Pakistan" />
              </div>
            </Section>

            {/* Shipping Address */}
            <Section title="Shipping Address">
              <div className="grid grid-cols-2 gap-6">
                <Field label="Street Address" value="42 Harvest Rd" />
                <Field label="City" value="Lahore" />
                <Field label="ZIP Code" value="54000" />
                <Field label="State" value="Punjab" />
                <Field label="Country" value="Pakistan" />
              </div>
            </Section>
          </div>
        </div>
      )}

      {activeTab === "opportunities" && <div>Opportunities content</div>}
      {activeTab === "tasks" && <div>Tasks content</div>}
      {activeTab === "contacts" && <div>Contacts content</div>}
      {activeTab === "notes" && <div>Notes content</div>}
      {activeTab === "attachments" && <div>Attachments content</div>}
      {activeTab === "emails" && <div>Emails content</div>}
      {activeTab === "quotes" && <div>Quotes content</div>}
    </div>
  );
}

/* ---------------- Components ---------------- */

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
      className={`py-3 border-b-2 transition text-sm
        ${
          active
            ? "border-blue-600 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700"
        }`}
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
    <div className="bg-white border rounded-md p-6">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        value={value}
        readOnly
        className="w-full border rounded px-3 py-2 text-sm bg-gray-50"
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

function EditableRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
      <Pencil size={14} className="text-gray-400 cursor-pointer" />
    </div>
  );
}
