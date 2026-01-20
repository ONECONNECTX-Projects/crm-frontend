"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/app/common/InputFeild";
import { useError } from "@/app/providers/ErrorProvider";
import {
  Contact,
  ContactPayload,
  ContactInfo,
  ContactAddress,
  createContact,
  updateContact,
  getAllActiveCompanies,
} from "@/app/services/contact/contact.service";
import { getAllActiveIndustry } from "@/app/services/Industry/industry.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveDepartment } from "@/app/services/department/departments.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { getAllActiveContactStage } from "@/app/services/contact-stages/contact-stages.service";
import { getAllActiveContactSource } from "@/app/services/contact-source/contact-source.service";

interface CreateContactFormProps {
  mode: "create" | "edit";
  data?: Contact;
  onClose: () => void;
  onSuccess?: () => void;
}

const initialContactInfo: ContactInfo = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  birthday: "",
  job_title: "",
  owner_id: 0,
  company_id: 0,
  department_id: 0,
  industry_id: 0,
  contact_source_id: 0,
  contact_stage_id: 0,
  twitter: "",
  linkedin: "",
};

const initialAddress: ContactAddress = {
  present_address: "",
  present_city: "",
  present_state: "",
  present_zip: "",
  present_country: "",
  permanent_address: "",
  permanent_city: "",
  permanent_state: "",
  permanent_zip: "",
  permanent_country: "",
};

const steps = [
  { id: 1, title: "Contact Information" },
  { id: 2, title: "Address Information" },
];

export default function CreateContactForm({
  mode,
  data,
  onClose,
  onSuccess,
}: CreateContactFormProps) {
  const { showSuccess, showError } = useError();
  const [currentStep, setCurrentStep] = useState(1);
  const [contactInfo, setContactInfo] =
    useState<ContactInfo>(initialContactInfo);
  const [address, setAddress] = useState<ContactAddress>(initialAddress);
  const [submitting, setSubmitting] = useState(false);
  const [copyAddress, setCopyAddress] = useState(false);

  // Dropdown options
  const [owners, setOwners] = useState<OptionDropDownModel[]>([]);
  const [companies, setCompanies] = useState<OptionDropDownModel[]>([]);
  const [departments, setDepartments] = useState<OptionDropDownModel[]>([]);
  const [industries, setIndustries] = useState<OptionDropDownModel[]>([]);
  const [sources, setSources] = useState<OptionDropDownModel[]>([]);
  const [stages, setStages] = useState<OptionDropDownModel[]>([]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [
          ownersRes,
          companiesRes,
          departmentsRes,
          industriesRes,
          sourcesRes,
          stagesRes,
        ] = await Promise.all([
          getAllActiveUsers(),
          getAllActiveCompanies(),
          getAllActiveDepartment(),
          getAllActiveIndustry(),
          getAllActiveContactSource(),
          getAllActiveContactStage(),
        ]);
        setOwners(ownersRes.data || []);
        setCompanies(companiesRes.data || []);
        setDepartments(departmentsRes.data || []);
        setIndustries(industriesRes.data || []);
        setSources(sourcesRes.data || []);
        setStages(stagesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };
    fetchDropdowns();
  }, []);

  // Load data on edit
  useEffect(() => {
    if (mode === "edit" && data) {
      setContactInfo({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        birthday: data.birthday || "",
        job_title: data.job_title || "",
        owner_id: data.owner_id || 0,
        company_id: data.company_id || 0,
        department_id: data.department_id || 0,
        industry_id: data.industry_id || 0,
        contact_source_id: data.contact_source_id || 0,
        contact_stage_id: data.contact_stage_id || 0,
        twitter: data.twitter || "",
        linkedin: data.linkedin || "",
      });
      if (data.address) {
        setAddress({
          present_address: data.address.present_address || "",
          present_city: data.address.present_city || "",
          present_state: data.address.present_state || "",
          present_zip: data.address.present_zip || "",
          present_country: data.address.present_country || "",
          permanent_address: data.address.permanent_address || "",
          permanent_city: data.address.permanent_city || "",
          permanent_state: data.address.permanent_state || "",
          permanent_zip: data.address.permanent_zip || "",
          permanent_country: data.address.permanent_country || "",
        });
      }
    } else {
      setContactInfo(initialContactInfo);
      setAddress(initialAddress);
    }
  }, [mode, data]);

  // Copy present address to permanent address
  const handleCopyAddress = (checked: boolean) => {
    setCopyAddress(checked);
    if (checked) {
      setAddress((prev) => ({
        ...prev,
        permanent_address: prev.present_address,
        permanent_city: prev.present_city,
        permanent_state: prev.present_state,
        permanent_zip: prev.present_zip,
        permanent_country: prev.present_country,
      }));
    }
  };

  const validateStep1 = () => {
    if (!contactInfo.first_name.trim()) {
      showError("Please enter first name");
      return false;
    }
    if (!contactInfo.last_name.trim()) {
      showError("Please enter last name");
      return false;
    }
    if (!contactInfo.email.trim()) {
      showError("Please enter email address");
      return false;
    }
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
      const payload: ContactPayload = {
        contact: contactInfo,
        address: address,
      };

      if (mode === "edit" && data?.id) {
        await updateContact(data.id, payload);
        showSuccess("Contact updated successfully");
      } else {
        await createContact(payload);
        showSuccess("Contact created successfully");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save contact:", error);
      showError("Failed to save contact");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit Contact" : "Create Contact"}
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
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <InputField
                label="First Name *"
                value={contactInfo.first_name}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, first_name: v })
                }
                noLeadingSpace
                placeholder="Enter first name"
              />
              <InputField
                label="Last Name *"
                value={contactInfo.last_name}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, last_name: v })
                }
                noLeadingSpace
                placeholder="Enter last name"
              />
              <InputField
                label="Email *"
                value={contactInfo.email}
                onChange={(v) => setContactInfo({ ...contactInfo, email: v })}
                noLeadingSpace
                placeholder="Enter email address"
              />
              <InputField
                label="Phone"
                value={contactInfo.phone}
                onChange={(v) => setContactInfo({ ...contactInfo, phone: v })}
                noLeadingSpace
                placeholder="Enter phone number"
              />
              <InputField
                label="Birthday"
                value={contactInfo.birthday}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, birthday: v })
                }
                type="date"
              />
              <InputField
                label="Job Title"
                value={contactInfo.job_title}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, job_title: v })
                }
                noLeadingSpace
                placeholder="Enter job title"
              />
              <SelectField
                label="Owner"
                value={contactInfo.owner_id}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, owner_id: v })
                }
                options={owners}
                placeholder="Select Owner"
              />
              <SelectField
                label="Company"
                value={contactInfo.company_id}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, company_id: v })
                }
                options={companies}
                placeholder="Select Company"
              />
              <SelectField
                label="Department"
                value={contactInfo.department_id}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, department_id: v })
                }
                options={departments}
                placeholder="Select Department"
              />
              <SelectField
                label="Industry"
                value={contactInfo.industry_id}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, industry_id: v })
                }
                options={industries}
                placeholder="Select Industry"
              />
              <SelectField
                label="Contact Source"
                value={contactInfo.contact_source_id}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, contact_source_id: v })
                }
                options={sources}
                placeholder="Select Source"
              />
              <SelectField
                label="Contact Stage"
                value={contactInfo.contact_stage_id}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, contact_stage_id: v })
                }
                options={stages}
                placeholder="Select Stage"
              />
              <InputField
                label="Twitter"
                value={contactInfo.twitter}
                onChange={(v) => setContactInfo({ ...contactInfo, twitter: v })}
                noLeadingSpace
                placeholder="https://twitter.com/username"
              />
              <InputField
                label="LinkedIn"
                value={contactInfo.linkedin}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, linkedin: v })
                }
                noLeadingSpace
                placeholder="https://linkedin.com/in/username"
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
                Present Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="md:col-span-2">
                  <InputField
                    label="Address"
                    value={address.present_address}
                    onChange={(v) =>
                      setAddress({ ...address, present_address: v })
                    }
                    noLeadingSpace
                    placeholder="Enter street address"
                  />
                </div>
                <InputField
                  label="City"
                  value={address.present_city}
                  onChange={(v) => setAddress({ ...address, present_city: v })}
                  noLeadingSpace
                  placeholder="Enter city"
                />
                <InputField
                  label="State"
                  value={address.present_state}
                  onChange={(v) => setAddress({ ...address, present_state: v })}
                  noLeadingSpace
                  placeholder="Enter state"
                />
                <InputField
                  label="ZIP Code"
                  value={address.present_zip}
                  onChange={(v) => setAddress({ ...address, present_zip: v })}
                  noLeadingSpace
                  placeholder="Enter ZIP code"
                />
                <InputField
                  label="Country"
                  value={address.present_country}
                  onChange={(v) =>
                    setAddress({ ...address, present_country: v })
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
                Same as Present Address
              </label>
            </div>

            {/* Permanent Address */}
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-4">
                Permanent Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="md:col-span-2">
                  <InputField
                    label="Address"
                    value={address.permanent_address}
                    onChange={(v) =>
                      setAddress({ ...address, permanent_address: v })
                    }
                    noLeadingSpace
                    placeholder="Enter street address"
                    disabled={copyAddress}
                  />
                </div>
                <InputField
                  label="City"
                  value={address.permanent_city}
                  onChange={(v) =>
                    setAddress({ ...address, permanent_city: v })
                  }
                  noLeadingSpace
                  placeholder="Enter city"
                  disabled={copyAddress}
                />
                <InputField
                  label="State"
                  value={address.permanent_state}
                  onChange={(v) =>
                    setAddress({ ...address, permanent_state: v })
                  }
                  noLeadingSpace
                  placeholder="Enter state"
                  disabled={copyAddress}
                />
                <InputField
                  label="ZIP Code"
                  value={address.permanent_zip}
                  onChange={(v) => setAddress({ ...address, permanent_zip: v })}
                  noLeadingSpace
                  placeholder="Enter ZIP code"
                  disabled={copyAddress}
                />
                <InputField
                  label="Country"
                  value={address.permanent_country}
                  onChange={(v) =>
                    setAddress({ ...address, permanent_country: v })
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
                  ? "Update Contact"
                  : "Create Contact"}
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
