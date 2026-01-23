"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/app/common/InputFeild";
import { useError } from "@/app/providers/ErrorProvider";
import { getAllActiveIndustry } from "@/app/services/Industry/industry.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveDepartment } from "@/app/services/department/departments.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import {
  Company,
  CompanyAddress,
  CompanyInfo,
  CompanyPayload,
  createCompany,
  updateCompany,
} from "@/app/services/company/company.service";
import { getAllActiveCompanyType } from "@/app/services/company-type/company-type.service";

interface CreateCompanyFormProps {
  mode: "create" | "edit";
  data?: Company;
  onClose: () => void;
  onSuccess?: () => void;
}

const initialCompanyInfo: CompanyInfo = {
  name: "",
  owner_id: 0,
  industry_id: 0,
  company_type_id: 0,
  company_size: "",
  annual_revenue: "0",
  phone: "",
  email: "",
  website: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  facebook: "",
};

const initialAddress: CompanyAddress = {
  billing_street: "",
  billing_city: "",
  billing_state: "",
  billing_zip: "",
  billing_country: "",
  shipping_street: "",
  shipping_city: "",
  shipping_zip: "",
  shipping_state: "",
  shipping_country: "",
};

const steps = [
  { id: 1, title: "Company Information" },
  { id: 2, title: "Billing Information" },
];

export default function CreateCompanyForm({
  mode,
  data,
  onClose,
  onSuccess,
}: CreateCompanyFormProps) {
  const { showSuccess, showError } = useError();
  const [currentStep, setCurrentStep] = useState(1);
  const [CompanyInfo, setCompanyInfo] =
    useState<CompanyInfo>(initialCompanyInfo);
  const [address, setAddress] = useState<CompanyAddress>(initialAddress);
  const [submitting, setSubmitting] = useState(false);
  const [copyAddress, setCopyAddress] = useState(false);

  // Dropdown options
  const [owners, setOwners] = useState<OptionDropDownModel[]>([]);
  const [industries, setIndustries] = useState<OptionDropDownModel[]>([]);
  const [companyTypes, setCompanyType] = useState<OptionDropDownModel[]>([]);

  // Fetch dropdown data
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
        console.error("Failed to fetch dropdown data:", error);
      }
    };
    fetchDropdowns();
  }, []);

  // Load data on edit
  useEffect(() => {
    if (mode === "edit" && data) {
      setCompanyInfo({
        name: data.name || "",
        owner_id: data.owner_id || 0,
        company_type_id: data.company_type_id || 0,
        company_size: data.company_size || "",
        industry_id: data.industry_id || 0,
        annual_revenue: data.annual_revenue || "",
        twitter: data.twitter || "",
        linkedin: data.linkedin || "",
        email: data.email || "",
        facebook: data.facebook || "",
        instagram: data.instagram || "",
        phone: data.phone || "",
        website: data.website || "",
      });
      if (data.address) {
        setAddress({
          billing_city: data.address.billing_city,
          billing_country: data.address.billing_country,
          billing_state: data.address.billing_state,
          billing_street: data.address.billing_street,
          billing_zip: data.address.billing_zip,
          shipping_city: data.address.shipping_city,
          shipping_country: data.address.shipping_country,
          shipping_state: data.address.shipping_state,
          shipping_street: data.address.shipping_street,
          shipping_zip: data.address.shipping_zip,
        });
      }
    } else {
      setCompanyInfo(initialCompanyInfo);
      setAddress(initialAddress);
    }
  }, [mode, data]);

  // Copy present address to permanent address
  const handleCopyAddress = (checked: boolean) => {
    setCopyAddress(checked);
    if (checked) {
      setAddress((prev) => ({
        ...prev,
        shipping_street: prev.billing_street,
        shipping_city: prev.billing_city,
        shipping_state: prev.billing_state,
        shipping_zip: prev.billing_zip,
        shipping_country: prev.billing_country,
      }));
    }
  };

  const validateStep1 = () => {
    if (!CompanyInfo.name.trim()) {
      showError("Please enter name");
      return false;
    }
    // if (!CompanyInfo.email.trim()) {
    //   showError("Please enter email address");
    //   return false;
    // }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload: CompanyPayload = {
        company: CompanyInfo,
        address: address,
      };

      if (mode === "edit") {
        await updateCompany(data?.id || 0, payload);
        showSuccess("Company updated successfully");
      } else {
        await createCompany(payload);
        showSuccess("Company created successfully");
      }
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save Company:", error);
      showError("Failed to save Company");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit Company" : "Create Company"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          X
        </button>
      </div>

      {/* Stepper */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Step 1: Company Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <InputField
                label="Name *"
                value={CompanyInfo.name}
                onChange={(v) => setCompanyInfo({ ...CompanyInfo, name: v })}
                noLeadingSpace
                placeholder="Enter Name"
              />
              <SelectField
                label="Owner"
                value={CompanyInfo.owner_id}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, owner_id: v })
                }
                options={owners}
                placeholder="Select Owner"
              />
              <InputField
                label="Phone"
                value={CompanyInfo.phone}
                onChange={(v) => setCompanyInfo({ ...CompanyInfo, phone: v })}
                noLeadingSpace
                placeholder="Enter phone number"
              />
              <InputField
                label="Company Size"
                value={CompanyInfo.company_size}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, company_size: v })
                }
              />
              <InputField
                label="Annual Revenue"
                value={CompanyInfo.annual_revenue}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, annual_revenue: v })
                }
              />
              <InputField
                label="Email"
                value={CompanyInfo.email}
                onChange={(v) => setCompanyInfo({ ...CompanyInfo, email: v })}
              />
              <SelectField
                label="Industry"
                value={CompanyInfo.industry_id}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, industry_id: v })
                }
                options={industries}
                placeholder="Select Industry"
              />

              <SelectField
                label="Company"
                value={CompanyInfo.company_type_id}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, company_type_id: v })
                }
                options={companyTypes}
                placeholder="Select Company Type"
              />

              <InputField
                label="Website"
                value={CompanyInfo.website}
                onChange={(v) => setCompanyInfo({ ...CompanyInfo, website: v })}
                noLeadingSpace
                placeholder="https://twitter.com/username"
              />
              <InputField
                label="Twitter"
                value={CompanyInfo.twitter}
                onChange={(v) => setCompanyInfo({ ...CompanyInfo, twitter: v })}
                noLeadingSpace
                placeholder="https://twitter.com/username"
              />
              <InputField
                label="LinkedIn"
                value={CompanyInfo.linkedin}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, linkedin: v })
                }
                noLeadingSpace
                placeholder="https://linkedin.com/in/username"
              />
              <InputField
                label="Instagram"
                value={CompanyInfo.instagram}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, instagram: v })
                }
                noLeadingSpace
                placeholder="https://twitter.com/username"
              />
              <InputField
                label="FaceBook"
                value={CompanyInfo.facebook}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, facebook: v })
                }
                noLeadingSpace
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>
        )}

        {/* Step 2: Address Information */}
        {currentStep === 2 && (
          <div className="space-y-8">
            {/* Present Address */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-4">
                Billing Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="md:col-span-2">
                  <InputField
                    label="Address"
                    value={address.billing_street}
                    onChange={(v) =>
                      setAddress({ ...address, billing_street: v })
                    }
                    noLeadingSpace
                    placeholder="Enter street address"
                  />
                </div>
                <InputField
                  label="City"
                  value={address.billing_city}
                  onChange={(v) => setAddress({ ...address, billing_city: v })}
                  noLeadingSpace
                  placeholder="Enter city"
                />
                <InputField
                  label="State"
                  value={address.billing_state}
                  onChange={(v) => setAddress({ ...address, billing_state: v })}
                  noLeadingSpace
                  placeholder="Enter state"
                />
                <InputField
                  label="ZIP Code"
                  value={address.billing_zip}
                  onChange={(v) => setAddress({ ...address, billing_zip: v })}
                  noLeadingSpace
                  placeholder="Enter ZIP code"
                />
                <InputField
                  label="Country"
                  value={address.billing_country}
                  onChange={(v) =>
                    setAddress({ ...address, billing_country: v })
                  }
                  noLeadingSpace
                  placeholder="Enter country"
                />
              </div>
            </div>

            {/* Copy Address Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="copyAddress"
                checked={copyAddress}
                onChange={(e) => handleCopyAddress(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="copyAddress" className="text-sm text-gray-700">
                Same as Billing Address
              </label>
            </div>

            {/* Permanent Address */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-4">
                Shipping Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="md:col-span-2">
                  <InputField
                    label="Address"
                    value={address.shipping_street}
                    onChange={(v) =>
                      setAddress({ ...address, shipping_street: v })
                    }
                    noLeadingSpace
                    placeholder="Enter street address"
                    disabled={copyAddress}
                  />
                </div>
                <InputField
                  label="City"
                  value={address.shipping_city}
                  onChange={(v) => setAddress({ ...address, shipping_city: v })}
                  noLeadingSpace
                  placeholder="Enter city"
                  disabled={copyAddress}
                />
                <InputField
                  label="State"
                  value={address.shipping_state}
                  onChange={(v) =>
                    setAddress({ ...address, shipping_state: v })
                  }
                  noLeadingSpace
                  placeholder="Enter state"
                  disabled={copyAddress}
                />
                <InputField
                  label="ZIP Code"
                  value={address.shipping_zip}
                  onChange={(v) => setAddress({ ...address, shipping_zip: v })}
                  noLeadingSpace
                  placeholder="Enter ZIP code"
                  disabled={copyAddress}
                />
                <InputField
                  label="Country"
                  value={address.shipping_country}
                  onChange={(v) =>
                    setAddress({ ...address, shipping_country: v })
                  }
                  noLeadingSpace
                  placeholder="Enter country"
                  disabled={copyAddress}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between px-6 py-4 border-t">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={submitting}
            >
              Previous
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting
                ? mode === "edit"
                  ? "Updating..."
                  : "Creating..."
                : mode === "edit"
                  ? "Update Company"
                  : "Create Company"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- HELPER COMPONENTS ---------- */

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  options: OptionDropDownModel[];
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value={0}>{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
