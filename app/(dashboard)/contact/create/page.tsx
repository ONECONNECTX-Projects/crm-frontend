"use client";

import { useEffect, useState, useCallback } from "react";
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
} from "@/app/services/contact/contact.service";
import { getAllActiveIndustry } from "@/app/services/Industry/industry.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveDepartment } from "@/app/services/department/departments.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { getAllActiveContactStage } from "@/app/services/contact-stages/contact-stages.service";
import { getAllActiveContactSource } from "@/app/services/contact-source/contact-source.service";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import CreateContactSourceForm from "../../settings/contact-setup/contact-source/create/page";
import CreateContactStageForm from "../../settings/contact-setup/contact-stage/create/page";
import CreateIndustryForm from "../../settings/company-setup/industry/create/page";
import SelectDropdown from "@/app/common/dropdown";
import SlideOver from "@/app/common/slideOver";
import CreateCompanyForm from "../../company/create/page";
import { getAllActiveCompany } from "@/app/services/company/company.service";

interface CreateContactFormProps {
  mode: "create" | "edit";
  data?: Contact;
  onClose: () => void;
  onSuccess?: () => void;
  defaultCompanyId?: number;
}

const initialContactInfo: ContactInfo = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  birthday: "",
  job_title: "",
  owner_id: "",
  company_id: "",
  department_id: "",
  industry_id: "",
  contact_source_id: "",
  contact_stage_id: "",
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
  defaultCompanyId,
}: CreateContactFormProps) {
  const { showSuccess, showError } = useError();
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    ...initialContactInfo,
    company_id: defaultCompanyId ? String(defaultCompanyId) : "",
  });
  const [address, setAddress] = useState<ContactAddress>(initialAddress);
  const [submitting, setSubmitting] = useState(false);
  const [copyAddress, setCopyAddress] = useState(false);

  // Dropdown States
  const [owners, setOwners] = useState<OptionDropDownModel[]>([]);
  const [companies, setCompanies] = useState<OptionDropDownModel[]>([]);
  const [departments, setDepartments] = useState<OptionDropDownModel[]>([]);
  const [industries, setIndustries] = useState<OptionDropDownModel[]>([]);
  const [sources, setSources] = useState<OptionDropDownModel[]>([]);
  const [stages, setStages] = useState<OptionDropDownModel[]>([]);

  // Modal States
  const [openContactSourceModal, setOpenContactSourceModal] = useState(false);
  const [openContactStageModal, setOpenContactStageModal] = useState(false);
  const [openIndustryModal, setOpenIndustryModal] = useState(false);
  const [openDepartmentModal, setOpenDepartmentModal] = useState(false);
  const [openCompanySlider, setOpenCompanySlider] = useState(false);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [o, c, d, i, src, stg] = await Promise.all([
          getAllActiveUsers(),
          getAllActiveCompany(),
          getAllActiveDepartment(),
          getAllActiveIndustry(),
          getAllActiveContactSource(),
          getAllActiveContactStage(),
        ]);
        setOwners(o.data || []);
        setCompanies(c.data || []);
        setDepartments(d.data || []);
        setIndustries(i.data || []);
        setSources(src.data || []);
        setStages(stg.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (mode === "edit" && data) {
      setContactInfo({ ...data });
      if (data.address) setAddress({ ...data.address });
    }
  }, [mode, data]);

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

  // Centralized Validation Logic (Returns error object)
  const getValidationErrors = useCallback(() => {
    const errors: { [key: string]: string } = {};
    if (currentStep === 1) {
      if (!contactInfo.first_name.trim())
        errors.first_name = "First name is required";
      if (!contactInfo.last_name.trim())
        errors.last_name = "Last name is required";
      if (!contactInfo.email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
        errors.email = "Invalid email address";
      }
      if (contactInfo.phone && contactInfo.phone.trim().length !== 10) {
        errors.phone = "Phone must be exactly 10 digits";
      }
    }
    return errors;
  }, [currentStep, contactInfo]);

  const handleNext = () => {
    const errors = getValidationErrors();
    if (Object.keys(errors).length === 0) {
      setFieldErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      setFieldErrors(errors);
      showError("Please fill all required fields correctly");
    }
  };

  const handlePrevious = () => {
    setFieldErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const errors = getValidationErrors();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showError("Please fix validation errors before submitting");
      return; // Exit immediately to prevent double toast
    }

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
    } catch (error: any) {
      showError(error?.response?.data?.messages);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b">
        <h2 className="text-base sm:text-lg font-semibold">
          {mode === "edit" ? "Edit Contact" : "Create Contact"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stepper */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-gray-50/30">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep >= step.id ? "bg-brand-500 text-white shadow-md shadow-brand-100" : "bg-gray-200 text-gray-500"}`}
                >
                  {step.id}
                </div>
                <span
                  className={`ml-1.5 sm:ml-2 text-xs sm:text-sm font-semibold ${currentStep >= step.id ? "text-brand-500" : "text-gray-400"}`}
                >
                  <span className="hidden xs:inline">{step.title}</span>
                  <span className="xs:hidden">{step.id === 1 ? "Info" : "Address"}</span>
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-20 h-0.5 mx-2 sm:mx-4 transition-all ${currentStep > step.id ? "bg-brand-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <InputField
                label="First Name"
                required
                error={fieldErrors.first_name}
                value={contactInfo.first_name}
                onChange={(v) => {
                  setContactInfo({ ...contactInfo, first_name: v });
                  if (v.trim())
                    setFieldErrors((p) => ({ ...p, first_name: "" }));
                }}
                noLeadingSpace
                placeholder="First name"
              />
              <InputField
                label="Last Name"
                required
                error={fieldErrors.last_name}
                value={contactInfo.last_name}
                onChange={(v) => {
                  setContactInfo({ ...contactInfo, last_name: v });
                  if (v.trim())
                    setFieldErrors((p) => ({ ...p, last_name: "" }));
                }}
                noLeadingSpace
                placeholder="Last name"
              />
              <InputField
                label="Email"
                required
                error={fieldErrors.email}
                value={contactInfo.email}
                onChange={(v) => {
                  setContactInfo({ ...contactInfo, email: v });
                  if (v.trim()) setFieldErrors((p) => ({ ...p, email: "" }));
                }}
                noLeadingSpace
                placeholder="Email address"
              />
              <InputField
                label="Phone"
                error={fieldErrors.phone}
                value={contactInfo.phone}
                maxLength={10}
                onChange={(v) => {
                  const val = v.replace(/\D/g, "");
                  setContactInfo({ ...contactInfo, phone: val });
                  if (val.length === 10)
                    setFieldErrors((p) => ({ ...p, phone: "" }));
                }}
                noLeadingSpace
                placeholder="10-digit number"
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
                placeholder="Job title"
              />

              <SelectDropdown
                label="Owner"
                value={contactInfo.owner_id}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, owner_id: v })
                }
                options={owners.map((o) => ({ label: o.name, value: o.id }))}
                placeholder="Select Owner"
              />
              <SelectDropdown
                label="Company"
                value={contactInfo.company_id}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, company_id: v })
                }
                options={companies.map((c) => ({ label: c.name, value: c.id }))}
                onAddClick={() => setOpenCompanySlider(true)}
                placeholder="Select Company"
              />
              <SelectDropdown
                label="Department"
                value={contactInfo.department_id}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, department_id: v })
                }
                options={departments.map((d) => ({
                  label: d.name,
                  value: d.id,
                }))}
                onAddClick={() => setOpenDepartmentModal(true)}
                placeholder="Select Department"
              />
              <SelectDropdown
                label="Industry"
                value={contactInfo.industry_id}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, industry_id: v })
                }
                options={industries.map((i) => ({
                  label: i.name,
                  value: i.id,
                }))}
                onAddClick={() => setOpenIndustryModal(true)}
                placeholder="Select Industry"
              />
              <SelectDropdown
                label="Source"
                value={contactInfo.contact_source_id}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, contact_source_id: v })
                }
                options={sources.map((s) => ({ label: s.name, value: s.id }))}
                onAddClick={() => setOpenContactSourceModal(true)}
                placeholder="Select Source"
              />
              <SelectDropdown
                label="Stage"
                value={contactInfo.contact_stage_id}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, contact_stage_id: v })
                }
                options={stages.map((s) => ({ label: s.name, value: s.id }))}
                onAddClick={() => setOpenContactStageModal(true)}
                placeholder="Select Stage"
              />
              <InputField
                label="Twitter"
                value={contactInfo.twitter}
                onChange={(v) => setContactInfo({ ...contactInfo, twitter: v })}
                placeholder="Twitter URL"
              />
              <InputField
                label="LinkedIn"
                value={contactInfo.linkedin}
                onChange={(v) =>
                  setContactInfo({ ...contactInfo, linkedin: v })
                }
                placeholder="LinkedIn URL"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <AddressGroup
              title="Present Address"
              address={address}
              setAddress={setAddress}
              prefix="present"
            />
            <div className="flex items-center gap-2 bg-brand-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-brand-100 shadow-sm">
              <input
                type="checkbox"
                id="copyAddress"
                checked={copyAddress}
                onChange={(e) => handleCopyAddress(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-brand-200"
              />
              <label
                htmlFor="copyAddress"
                className="text-xs sm:text-sm font-semibold text-brand-700"
              >
                Same as Present Address
              </label>
            </div>
            {!copyAddress && (
              <AddressGroup
                title="Permanent Address"
                address={address}
                setAddress={setAddress}
                prefix="permanent"
              />
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t bg-white">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={submitting || currentStep === 1}
          className="w-full sm:w-auto"
        >
          Previous
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="ghost" onClick={onClose} disabled={submitting} className="w-full sm:w-auto order-2 sm:order-1">
            Cancel
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="w-full sm:w-auto order-1 sm:order-2">Next</Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full sm:w-auto sm:min-w-[120px] order-1 sm:order-2"
            >
              {submitting
                ? "Processing..."
                : mode === "edit"
                  ? "Update Contact"
                  : "Create Contact"}
            </Button>
          )}
        </div>
      </div>

      {/* Helper Dialogs/Sliders Logic */}
      {openContactSourceModal && (
        <Dialog
          open={openContactSourceModal}
          onOpenChange={setOpenContactSourceModal}
        >
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader />
            <CreateContactSourceForm
              mode="create"
              onClose={() => setOpenContactSourceModal(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenContactSourceModal(false);
                const res = await getAllActiveContactSource();
                setSources(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {openContactStageModal && (
        <Dialog
          open={openContactStageModal}
          onOpenChange={setOpenContactStageModal}
        >
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader />
            <CreateContactStageForm
              mode="create"
              onClose={() => setOpenContactStageModal(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenContactStageModal(false);
                const res = await getAllActiveContactStage();
                setStages(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {openIndustryModal && (
        <Dialog open={openIndustryModal} onOpenChange={setOpenIndustryModal}>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader />
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

      {openCompanySlider && (
        <SlideOver
          open={openCompanySlider}
          onClose={() => setOpenCompanySlider(false)}
          width="max-w-2xl"
        >
          <CreateCompanyForm
            mode="create"
            onClose={() => setOpenCompanySlider(false)}
            onSuccess={async () => {
              setOpenCompanySlider(false);
              const res = await getAllActiveCompany();
              setCompanies(res.data || []);
            }}
          />
        </SlideOver>
      )}
    </div>
  );
}

function AddressGroup({ title, address, setAddress, prefix }: any) {
  const update = (key: string, v: string) =>
    setAddress((p: any) => ({ ...p, [`${prefix}_${key}`]: v }));
  return (
    <div>
      <h3 className="text-sm sm:text-md font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-brand-500 rounded-full" /> {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-5">
        <div className="md:col-span-2">
          <InputField
            label="Address"
            value={address[`${prefix}_address`]}
            onChange={(v) => update("address", v)}
            placeholder="Street address"
          />
        </div>
        <InputField
          label="City"
          value={address[`${prefix}_city`]}
          onChange={(v) => update("city", v)}
          placeholder="City"
        />
        <InputField
          label="State"
          value={address[`${prefix}_state`]}
          onChange={(v) => update("state", v)}
          placeholder="State"
        />
        <InputField
          label="ZIP Code"
          value={address[`${prefix}_zip`]}
          onChange={(v) => update("zip", v)}
          placeholder="ZIP"
        />
        <InputField
          label="Country"
          value={address[`${prefix}_country`]}
          onChange={(v) => update("country", v)}
          placeholder="Country"
        />
      </div>
    </div>
  );
}
