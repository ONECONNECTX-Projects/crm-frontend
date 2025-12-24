"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type Mode = "create" | "edit";
type Tab = "company" | "billing";

export default function CreateCompanyForm({
  onClose,
  mode = "create",
}: {
  onClose: () => void;
  mode?: Mode;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("company");
  const isEdit = mode === "edit";

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Company" : "Create Company"}
        </h2>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b">
        <div className="flex gap-6 text-sm font-medium">
          <TabButton
            label="Company Information"
            active={activeTab === "company"}
            onClick={() => setActiveTab("company")}
          />
          <TabButton
            label="Billing Information"
            active={activeTab === "billing"}
            onClick={() => setActiveTab("billing")}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === "company" && <CompanyInfo />}
        {activeTab === "billing" && <BillingInfo />}
      </div>

      {/* Footer */}
      <div className="flex justify-end px-6 py-4 border-t">
        <Button
          onClick={() =>
            isEdit
              ? console.log("Update Company")
              : console.log("Submit Company")
          }
        >
          {isEdit ? "Update" : "Submit"}
        </Button>
      </div>
    </div>
  );
}

/* ---------- Step Components ---------- */

function CompanyInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      <Field label="Company name *" />
      <Field label="Company owner" type="select" />
      <Field label="Industry" type="select" />
      <Field label="Company Type" type="select" />
      <Field label="Company size" />
      <Field label="Annual revenue" />
      <Field label="Phone" />
      <Field label="Email" />
      <Field label="Website" />
      <Field label="LinkedIn" />
      <Field label="Twitter" />
      <Field label="Instagram" />
      <Field label="Facebook" />
    </div>
  );
}

function BillingInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      <Field label="Billing street" />
      <Field label="Billing city" />
      <Field label="Billing zip code" />
      <Field label="Billing state" />
      <Field label="Billing country" />

      <div className="md:col-span-2 text-sm font-medium text-blue-600 cursor-pointer">
        Copy Billing Information
      </div>

      <Field label="Shipping street" />
      <Field label="Shipping city" />
      <Field label="Shipping zip code" />
      <Field label="Shipping state" />
      <Field label="Shipping country" />
    </div>
  );
}

/* ---------- Reusable ---------- */

function Step({
  label,
  active,
  completed,
}: {
  label: string;
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium
        ${active || completed ? "bg-blue-600 text-white" : "bg-gray-200"}`}
      >
        {completed ? <Check size={14} /> : ""}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function Field({
  label,
  type = "input",
}: {
  label: string;
  type?: "input" | "select";
}) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      {type === "select" ? (
        <select className="w-full rounded-md border px-3 py-2 text-sm">
          <option>Select</option>
        </select>
      ) : (
        <input className="w-full rounded-md border px-3 py-2 text-sm" />
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
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-3 border-b-2 transition-colors
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
