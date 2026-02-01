"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/app/common/InputFeild";
import { useError } from "@/app/providers/ErrorProvider";
import { getAllActiveIndustry } from "@/app/services/Industry/industry.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
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
import SelectDropdown from "@/app/common/dropdown";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import CreateIndustryForm from "../../settings/company-setup/industry/create/page";
import CreateCompanyTypeForm from "../../settings/company-setup/company-type/create/page";

interface CreateCompanyFormProps {
  mode: "create" | "edit";
  data?: Company;
  onClose: () => void;
  onSuccess?: () => void;
}

const initialCompanyInfo: CompanyInfo = {
  name: "",
  owner_id: "",
  industry_id: "",
  company_type_id: "",
  company_size: "",
  annual_revenue: "",
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
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({}); // Validation state
  const [submitting, setSubmitting] = useState(false);
  const [copyAddress, setCopyAddress] = useState(false);

  const [owners, setOwners] = useState<OptionDropDownModel[]>([]);
  const [industries, setIndustries] = useState<OptionDropDownModel[]>([]);
  const [companyTypes, setCompanyType] = useState<OptionDropDownModel[]>([]);

  const [openIndustryModal, setOpenIndustryModal] = useState(false);
  const [openCompanyTypeModal, setOpenCompanyTypeModal] = useState(false);

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

  useEffect(() => {
    if (mode === "edit" && data) {
      setCompanyInfo({
        name: data.name || "",
        owner_id: data.owner_id || "",
        company_type_id: data.company_type_id || "",
        company_size: data.company_size || "",
        industry_id: data.industry_id || "",
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
        setAddress({ ...data.address });
      }
    }
  }, [mode, data]);

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

  const validateStep = () => {
    const errors: { [key: string]: string } = {};
    if (currentStep === 1) {
      if (!CompanyInfo.name.trim()) errors.name = "Name is required";
      if (!CompanyInfo.owner_id) errors.owner_id = "Owner is required";
      if (!CompanyInfo.email.trim()) errors.email = "Email is required";
      if (CompanyInfo.phone && CompanyInfo.phone.trim().length !== 10) {
        errors.phone = "Phone number must be exactly 10 digits";
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      showError("Please fill required fields");
    }
  };

  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) {
      showError("Please fill required fields");
      return;
    }
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
    } catch (error: any) {
      showError(error?.response?.data?.message || "Server Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b">
        <h2 className="text-base sm:text-lg font-semibold">
          {mode === "edit" ? "Edit Company" : "Create Company"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
          X
        </button>
      </div>

      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${currentStep >= step.id ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  {step.id}
                </div>
                <span
                  className={`ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium ${currentStep >= step.id ? "text-brand-500" : "text-gray-500"}`}
                >
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">{step.id === 1 ? "Info" : "Address"}</span>
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-24 h-0.5 mx-2 sm:mx-4 ${currentStep > step.id ? "bg-brand-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-5">
              <InputField
                label="Name"
                required={true}
                error={fieldErrors.name}
                value={CompanyInfo.name}
                onChange={(v) => {
                  setCompanyInfo({ ...CompanyInfo, name: v });
                  if (v.trim())
                    setFieldErrors((prev) => ({
                      ...prev,
                      name: "",
                    }));
                }}
                noLeadingSpace
                placeholder="Enter Name"
              />
              <SelectDropdown
                label="Owner"
                required
                error={fieldErrors.owner_id}
                value={CompanyInfo.owner_id}
                onChange={(v) => {
                  setCompanyInfo({ ...CompanyInfo, owner_id: v });
                  setFieldErrors((prev) => ({ ...prev, owner_id: "" }));
                }}
                options={owners.map((source) => ({
                  label: source.name,
                  value: source.id,
                }))}
                placeholder="Select Owner"
              />
              <InputField
                label="Email"
                required={true}
                error={fieldErrors.email}
                value={CompanyInfo.email}
                onChange={(v) => {
                  setCompanyInfo({ ...CompanyInfo, email: v });
                  setFieldErrors((prev) => ({
                    ...prev,
                    name: "",
                  }));
                }}
                placeholder="Enter email"
              />
              <InputField
                label="Phone"
                error={fieldErrors.phone}
                value={CompanyInfo.phone}
                maxLength={10}
                onChange={(v) => {
                  const val = v.replace(/\D/g, "");
                  setCompanyInfo({ ...CompanyInfo, phone: val });
                  if (val.length === 10)
                    setFieldErrors((prev) => ({ ...prev, phone: "" }));
                }}
                noLeadingSpace
                placeholder="Enter 10-digit phone number"
              />
              <InputField
                label="Company Size"
                value={CompanyInfo.company_size}
                maxLength={10}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, company_size: v })
                }
                placeholder="Enter size"
              />
              <InputField
                label="Annual Revenue"
                value={CompanyInfo.annual_revenue}
                maxLength={10}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, annual_revenue: v })
                }
                placeholder="Enter revenue"
              />

              <SelectDropdown
                label="Industry"
                value={CompanyInfo.industry_id}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, industry_id: v })
                }
                options={industries.map((source) => ({
                  label: source.name,
                  value: source.id,
                }))}
                onAddClick={() => setOpenIndustryModal(true)}
                placeholder="Select Industry"
              />
              <SelectDropdown
                label="Company Type"
                value={CompanyInfo.company_type_id}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, company_type_id: v })
                }
                options={companyTypes.map((source) => ({
                  label: source.name,
                  value: source.id,
                }))}
                onAddClick={() => setOpenCompanyTypeModal(true)}
                placeholder="Select Company Type"
              />

              <InputField
                label="Twitter"
                value={CompanyInfo.twitter}
                onChange={(v) => setCompanyInfo({ ...CompanyInfo, twitter: v })}
                noLeadingSpace
                placeholder="Twitter URL"
              />
              <InputField
                label="LinkedIn"
                value={CompanyInfo.linkedin}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, linkedin: v })
                }
                noLeadingSpace
                placeholder="LinkedIn URL"
              />
              <InputField
                label="Instagram"
                value={CompanyInfo.instagram}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, instagram: v })
                }
                noLeadingSpace
                placeholder="Instagram URL"
              />
              <InputField
                label="FaceBook"
                value={CompanyInfo.facebook}
                onChange={(v) =>
                  setCompanyInfo({ ...CompanyInfo, facebook: v })
                }
                noLeadingSpace
                placeholder="Facebook URL"
              />
              <InputField
                label="Website"
                value={CompanyInfo.website}
                onChange={(v) => setCompanyInfo({ ...CompanyInfo, website: v })}
                noLeadingSpace
                placeholder="Website URL"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-sm sm:text-md font-semibold text-gray-800 mb-3 sm:mb-4">
                Billing Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-5">
                <div className="md:col-span-2">
                  <InputField
                    label="Address"
                    value={address.billing_street}
                    onChange={(v) =>
                      setAddress({ ...address, billing_street: v })
                    }
                    noLeadingSpace
                    placeholder="Street address"
                  />
                </div>
                <InputField
                  label="City"
                  value={address.billing_city}
                  onChange={(v) => setAddress({ ...address, billing_city: v })}
                  noLeadingSpace
                  placeholder="City"
                />
                <InputField
                  label="State"
                  value={address.billing_state}
                  onChange={(v) => setAddress({ ...address, billing_state: v })}
                  noLeadingSpace
                  placeholder="State"
                />
                <InputField
                  label="ZIP Code"
                  value={address.billing_zip}
                  onChange={(v) => setAddress({ ...address, billing_zip: v })}
                  noLeadingSpace
                  placeholder="ZIP"
                />
                <InputField
                  label="Country"
                  value={address.billing_country}
                  onChange={(v) =>
                    setAddress({ ...address, billing_country: v })
                  }
                  noLeadingSpace
                  placeholder="Country"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-brand-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-brand-100">
              <input
                type="checkbox"
                id="copyAddress"
                checked={copyAddress}
                onChange={(e) => handleCopyAddress(e.target.checked)}
                className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
              />
              <label htmlFor="copyAddress" className="text-xs sm:text-sm font-medium text-gray-700">
                Same as Billing Address
              </label>
            </div>

            <div>
              <h3 className="text-sm sm:text-md font-semibold text-gray-800 mb-3 sm:mb-4">
                Shipping Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-5">
                <div className="md:col-span-2">
                  <InputField
                    label="Address"
                    value={address.shipping_street}
                    onChange={(v) =>
                      setAddress({ ...address, shipping_street: v })
                    }
                    noLeadingSpace
                    placeholder="Street address"
                    disabled={copyAddress}
                  />
                </div>
                <InputField
                  label="City"
                  value={address.shipping_city}
                  onChange={(v) => setAddress({ ...address, shipping_city: v })}
                  noLeadingSpace
                  placeholder="City"
                  disabled={copyAddress}
                />
                <InputField
                  label="State"
                  value={address.shipping_state}
                  onChange={(v) =>
                    setAddress({ ...address, shipping_state: v })
                  }
                  noLeadingSpace
                  placeholder="State"
                  disabled={copyAddress}
                />
                <InputField
                  label="ZIP Code"
                  value={address.shipping_zip}
                  onChange={(v) => setAddress({ ...address, shipping_zip: v })}
                  noLeadingSpace
                  placeholder="ZIP"
                  disabled={copyAddress}
                />
                <InputField
                  label="Country"
                  value={address.shipping_country}
                  onChange={(v) =>
                    setAddress({ ...address, shipping_country: v })
                  }
                  noLeadingSpace
                  placeholder="Country"
                  disabled={copyAddress}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={submitting || currentStep === 1}
          className="w-full sm:w-auto"
        >
          Previous
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" onClick={onClose} disabled={submitting} className="w-full sm:w-auto order-2 sm:order-1">
            Cancel
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="w-full sm:w-auto order-1 sm:order-2">Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} className="w-full sm:w-auto order-1 sm:order-2">
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

      {openIndustryModal && (
        <Dialog open={openIndustryModal} onOpenChange={setOpenIndustryModal}>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <CreateIndustryForm
              mode="create"
              onClose={() => setOpenIndustryModal(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenIndustryModal(false);
                const res = await getAllActiveIndustry();
                setIndustries(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {openCompanyTypeModal && (
        <Dialog
          open={openCompanyTypeModal}
          onOpenChange={setOpenCompanyTypeModal}
        >
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <CreateCompanyTypeForm
              mode="create"
              onClose={() => setOpenCompanyTypeModal(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenCompanyTypeModal(false);
                const res = await getAllActiveCompanyType();
                setCompanyType(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
