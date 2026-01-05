"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Company } from "../page";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";

type Mode = "create" | "edit";
type Tab = "company" | "billing";

export default function CreateCompanyForm({
  onClose,
  mode = "create",
  companies,
}: {
  onClose: () => void;
  mode?: Mode;
  companies?: Company;
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
  const [formData, setFormData] = useState({
    companyName: "",
    companyOwner: "",
    industry: "",
    companyType: "",
    companySize: "",
    annualRevenue: "",
    phone: "",
    email: "",
    website: "",
    linkedIn: "",
    twitter: "",
    instagram: "",
    facebook: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      <InputField
        label="Company name *"
        value={formData.companyName}
        onChange={(value) => handleChange("companyName", value)}
        placeholder="Enter company name"
      />
      <SelectDropdown
        label="Company owner"
        value={formData.companyOwner}
        onChange={(value) => handleChange("companyOwner", value)}
        options={[
          { label: "Owner 1", value: "owner1" },
          { label: "Owner 2", value: "owner2" },
        ]}
        placeholder="Select owner"
      />
      <SelectDropdown
        label="Industry"
        value={formData.industry}
        onChange={(value) => handleChange("industry", value)}
        options={[
          { label: "Technology", value: "technology" },
          { label: "Finance", value: "finance" },
          { label: "Healthcare", value: "healthcare" },
        ]}
        placeholder="Select industry"
      />
      <SelectDropdown
        label="Company Type"
        value={formData.companyType}
        onChange={(value) => handleChange("companyType", value)}
        options={[
          { label: "Private", value: "private" },
          { label: "Public", value: "public" },
        ]}
        placeholder="Select type"
      />
      <InputField
        label="Company size"
        value={formData.companySize}
        onChange={(value) => handleChange("companySize", value)}
        placeholder="Enter company size"
      />
      <InputField
        label="Annual revenue"
        value={formData.annualRevenue}
        onChange={(value) => handleChange("annualRevenue", value)}
        placeholder="Enter annual revenue"
      />
      <InputField
        label="Phone"
        value={formData.phone}
        onChange={(value) => handleChange("phone", value)}
        placeholder="Enter phone number"
      />
      <InputField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => handleChange("email", value)}
        placeholder="Enter email"
      />
      <InputField
        label="Website"
        value={formData.website}
        onChange={(value) => handleChange("website", value)}
        placeholder="Enter website URL"
      />
      <InputField
        label="LinkedIn"
        value={formData.linkedIn}
        onChange={(value) => handleChange("linkedIn", value)}
        placeholder="Enter LinkedIn URL"
      />
      <InputField
        label="Twitter"
        value={formData.twitter}
        onChange={(value) => handleChange("twitter", value)}
        placeholder="Enter Twitter handle"
      />
      <InputField
        label="Instagram"
        value={formData.instagram}
        onChange={(value) => handleChange("instagram", value)}
        placeholder="Enter Instagram handle"
      />
      <InputField
        label="Facebook"
        value={formData.facebook}
        onChange={(value) => handleChange("facebook", value)}
        placeholder="Enter Facebook page"
      />
    </div>
  );
}

function BillingInfo() {
  const [formData, setFormData] = useState({
    billingStreet: "",
    billingCity: "",
    billingZipCode: "",
    billingState: "",
    billingCountry: "",
    shippingStreet: "",
    shippingCity: "",
    shippingZipCode: "",
    shippingState: "",
    shippingCountry: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const copyBillingToShipping = () => {
    setFormData((prev) => ({
      ...prev,
      shippingStreet: prev.billingStreet,
      shippingCity: prev.billingCity,
      shippingZipCode: prev.billingZipCode,
      shippingState: prev.billingState,
      shippingCountry: prev.billingCountry,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      <InputField
        label="Billing street"
        value={formData.billingStreet}
        onChange={(value) => handleChange("billingStreet", value)}
        placeholder="Enter billing street"
      />
      <InputField
        label="Billing city"
        value={formData.billingCity}
        onChange={(value) => handleChange("billingCity", value)}
        placeholder="Enter billing city"
      />
      <InputField
        label="Billing zip code"
        value={formData.billingZipCode}
        onChange={(value) => handleChange("billingZipCode", value)}
        placeholder="Enter billing zip code"
      />
      <InputField
        label="Billing state"
        value={formData.billingState}
        onChange={(value) => handleChange("billingState", value)}
        placeholder="Enter billing state"
      />
      <InputField
        label="Billing country"
        value={formData.billingCountry}
        onChange={(value) => handleChange("billingCountry", value)}
        placeholder="Enter billing country"
      />

      <div
        onClick={copyBillingToShipping}
        className="md:col-span-2 text-sm font-medium text-blue-600 cursor-pointer hover:underline"
      >
        Copy Billing Information
      </div>

      <InputField
        label="Shipping street"
        value={formData.shippingStreet}
        onChange={(value) => handleChange("shippingStreet", value)}
        placeholder="Enter shipping street"
      />
      <InputField
        label="Shipping city"
        value={formData.shippingCity}
        onChange={(value) => handleChange("shippingCity", value)}
        placeholder="Enter shipping city"
      />
      <InputField
        label="Shipping zip code"
        value={formData.shippingZipCode}
        onChange={(value) => handleChange("shippingZipCode", value)}
        placeholder="Enter shipping zip code"
      />
      <InputField
        label="Shipping state"
        value={formData.shippingState}
        onChange={(value) => handleChange("shippingState", value)}
        placeholder="Enter shipping state"
      />
      <InputField
        label="Shipping country"
        value={formData.shippingCountry}
        onChange={(value) => handleChange("shippingCountry", value)}
        placeholder="Enter shipping country"
      />
    </div>
  );
}

/* ---------- Reusable ---------- */

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
