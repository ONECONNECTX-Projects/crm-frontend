"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";
import DateInput from "@/app/common/CommonDate";
import { useError } from "@/app/providers/ErrorProvider";

// Import your service and types
import {
  Opportunity,
  OpportunityPayload,
  createOpportunity,
  updateOpportunity,
} from "@/app/services/opportunity/opportunity.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveContacts } from "@/app/services/contact/contact.service";
import { getAllActiveOpportunitySources } from "@/app/services/opportunity-source/opportunity-source.service";
import { getAllActiveOpportunityStages } from "@/app/services/opportunity-stage/opportunity-stage.service";
import { getAllActiveOpportunityTypes } from "@/app/services/opportunity-types/opportunity-types.service";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import CreateOpportunitySourceForm from "../../settings/opportunity-setup/opportunity-source/create/page";
import CreateOpportunityStageForm from "../../settings/opportunity-setup/opportunity-stage/create/page";
import CreateOpportunityTypeForm from "../../settings/opportunity-setup/opportunity-type/create/page";
import SlideOver from "@/app/common/slideOver";
import CreateCompanyForm from "../../company/create/page";
import CreateContactForm from "../../contact/create/page";
import { getAllActiveCompany } from "@/app/services/company/company.service";

interface CreateOpportunityProps {
  mode: "create" | "edit";
  data?: Opportunity;
  onClose: () => void;
  onSuccess?: () => void;
  defaultContactId?: number;
  defaultCompanyId?: number;
}

const steps = [
  { id: 1, title: "Opportunity Information" },
  { id: 2, title: "Additional Information" },
];

export default function CreateOpportunity({
  mode,
  data,
  onClose,
  onSuccess,
  defaultContactId,
  defaultCompanyId,
}: CreateOpportunityProps) {
  const { showSuccess, showError } = useError();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  //dropdown Modals
  const [opportunitiesSource, setOpportunitySource] = useState<
    OptionDropDownModel[]
  >([]);
  const [opportunitiesType, setOpportunityType] = useState<
    OptionDropDownModel[]
  >([]);
  const [opportunitiesStage, setOpportunityStage] = useState<
    OptionDropDownModel[]
  >([]);
  const [owners, setOwners] = useState<OptionDropDownModel[]>([]);

  const [companies, setCompanies] = useState<OptionDropDownModel[]>([]);
  const [contacts, setContact] = useState<OptionDropDownModel[]>([]);

  //Model Open
  const [openOpportunitiesSource, setOpenOpportunitySource] = useState(false);
  const [openOpportunitiesType, setOpenOpportunityType] = useState(false);
  const [openOpportunitiesStage, setOpenOpportunityStage] = useState(false);
  const [openCompanies, setOpenCompanies] = useState(false);
  const [openContacts, setOpenContact] = useState(false);

  // Single Form State matching OpportunityPayload
  const [formData, setFormData] = useState<OpportunityPayload>({
    name: "",
    amount: "",
    owner_id: "",
    company_id: defaultCompanyId ? String(defaultCompanyId) : "",
    contact_id: defaultContactId ? String(defaultContactId) : "",
    opportunity_source_id: "",
    opportunity_stage_id: "",
    opportunity_type_id: "",
    next_step: "",
    competitors: "",
    description: "",
    start_date: new Date(),
    close_date: new Date(),
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [
          ownersRes,
          companyRes,
          contactRes,
          opportunitySource,
          opportunityStage,
          opportunityType,
        ] = await Promise.all([
          getAllActiveUsers(),
          getAllActiveCompany(),
          getAllActiveContacts(),
          getAllActiveOpportunitySources(),
          getAllActiveOpportunityStages(),
          getAllActiveOpportunityTypes(),
        ]);
        setOwners(ownersRes.data || []);
        setCompanies(companyRes.data || []);
        setContact(contactRes.data || []);
        setOpportunitySource(opportunitySource.data || []);
        setOpportunityStage(opportunityStage.data || []);
        setOpportunityType(opportunityType.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };
    fetchDropdowns();
  }, []);

  // Load data on Edit
  useEffect(() => {
    if (mode === "edit" && data) {
      setFormData({
        name: data.name || "",
        amount: data.amount || "",
        owner_id: String(data.owner_id) || "",
        company_id: String(data.company_id) || "",
        contact_id: String(data.contact_id) || "",
        opportunity_source_id: String(data.opportunity_source_id) || "",
        opportunity_stage_id: String(data.opportunity_stage_id) || "",
        opportunity_type_id: String(data.opportunity_type_id) || "",
        next_step: data.next_step || "",
        competitors: data.competitors || "",
        description: data.description || "",
        start_date: data.start_date ? new Date(data.start_date) : new Date(),
        close_date: data.close_date ? new Date(data.close_date) : new Date(),
      });
    }
  }, [mode, data]);

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      showError("Opportunity Name is required");
      return false;
    }

    if (!formData.owner_id) {
      showError("Owner is required");
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
      if (mode === "edit" && data?.id) {
        await updateOpportunity(data.id, formData);
        showSuccess("Opportunity updated successfully");
      } else {
        await createOpportunity(formData);
        showSuccess("Opportunity created successfully");
      }
      onSuccess?.();
    } catch (error: any) {
      showError(error?.response?.data?.message || "Failed to save opportunity");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b">
        <h2 className="text-base sm:text-lg font-semibold">
          {mode === "edit" ? "Edit Opportunity" : "Create Opportunity"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <X size={20} />
        </button>
      </div>

      {/* Stepper */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                    currentStep >= step.id
                      ? "bg-brand-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium ${
                    currentStep >= step.id ? "text-brand-500" : "text-gray-500"
                  }`}
                >
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">
                    {step.id === 1 ? "Info" : "Details"}
                  </span>
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

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-5">
            <InputField
              label="Name"
              value={formData.name}
              required={true}
              noLeadingSpace
              onChange={(v) => setFormData({ ...formData, name: v })}
              placeholder="Enter Opportunity Name"
            />
            <SelectDropdown
              label="Owner"
              value={formData.owner_id}
              required={true}
              onChange={(v) => setFormData({ ...formData, owner_id: v })}
              options={owners.map((source) => ({
                label: source.name,
                value: source.id,
              }))}
              placeholder="Select Owner"
            />
            <InputField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(v) => setFormData({ ...formData, amount: v })}
              placeholder="Enter Amount"
            />
            <InputField
              label="Next Step"
              value={formData.next_step}
              onChange={(v) => setFormData({ ...formData, next_step: v })}
              placeholder="What's the next step?"
            />
            <DateInput
              label="Start Date"
              value={formData.start_date.toISOString().split("T")[0]}
              onChange={(v) => {
                if (v) {
                  setFormData({ ...formData, start_date: new Date(v) });
                }
              }}
            />
            <DateInput
              label="Close Date"
              value={formData.close_date.toISOString().split("T")[0]}
              onChange={(v) => {
                if (v) {
                  setFormData({ ...formData, close_date: new Date(v) });
                }
              }}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-5">
              <SelectDropdown
                label="Company"
                value={formData.company_id}
                onChange={(v) => setFormData({ ...formData, company_id: v })}
                options={companies.map((source) => ({
                  label: source.name,
                  value: source.id,
                }))}
                onAddClick={() => setOpenCompanies(true)}
              />
              <SelectDropdown
                label="Contact"
                value={formData.contact_id}
                onChange={(v) => setFormData({ ...formData, contact_id: v })}
                options={contacts.map((source) => ({
                  label: source.name,
                  value: source.id,
                }))}
                onAddClick={() => setOpenContact(true)}
              />
              <SelectDropdown
                label="Source"
                value={formData.opportunity_source_id}
                onChange={(v) =>
                  setFormData({ ...formData, opportunity_source_id: v })
                }
                options={opportunitiesSource.map((source) => ({
                  label: source.name,
                  value: source.id,
                }))}
                onAddClick={() => setOpenOpportunitySource(true)}
              />
              <SelectDropdown
                label="Stage"
                value={formData.opportunity_stage_id}
                onChange={(v) =>
                  setFormData({ ...formData, opportunity_stage_id: v })
                }
                options={opportunitiesStage.map((source) => ({
                  label: source.name,
                  value: source.id,
                }))}
                onAddClick={() => setOpenOpportunityStage(true)}
              />
              <SelectDropdown
                label="Type"
                value={formData.opportunity_type_id}
                onChange={(v) =>
                  setFormData({ ...formData, opportunity_type_id: v })
                }
                options={opportunitiesType.map((source) => ({
                  label: source.name,
                  value: source.id,
                }))}
                onAddClick={() => setOpenOpportunityType(true)}
              />
              <InputField
                label="Competitors"
                value={formData.competitors}
                onChange={(v) => setFormData({ ...formData, competitors: v })}
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="w-full mt-1 border rounded-md p-2.5 sm:p-3 min-h-[80px] sm:min-h-[100px] text-sm"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t bg-gray-50">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className={`w-full sm:w-auto ${currentStep === 1 ? "invisible" : ""}`}
        >
          Previous
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {submitting
                ? "Saving..."
                : mode === "edit"
                  ? "Update Opportunity"
                  : "Create Opportunity"}
            </Button>
          )}
        </div>
      </div>

      {openOpportunitiesSource && (
        <Dialog
          open={openOpportunitiesSource}
          onOpenChange={setOpenOpportunitySource}
        >
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader />
            <CreateOpportunitySourceForm
              mode="create"
              onClose={() => setOpenOpportunitySource(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenOpportunitySource(false);
                const res = await getAllActiveOpportunitySources();
                setOpportunitySource(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {openOpportunitiesStage && (
        <Dialog
          open={openOpportunitiesStage}
          onOpenChange={setOpenOpportunityStage}
        >
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader />
            <CreateOpportunityStageForm
              mode="create"
              onClose={() => setOpenOpportunityStage(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenOpportunityStage(false);
                const res = await getAllActiveOpportunityStages();
                setOpportunityStage(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {openOpportunitiesType && (
        <Dialog
          open={openOpportunitiesType}
          onOpenChange={setOpenOpportunityType}
        >
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader />
            <CreateOpportunityTypeForm
              mode="create"
              onClose={() => setOpenOpportunityType(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenOpportunityType(false);
                const res = await getAllActiveOpportunityTypes();
                setOpportunityType(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {openCompanies && (
        <SlideOver
          open={openCompanies}
          onClose={() => setOpenCompanies(false)}
          width="sm:w-[70vw] lg:w-[40vw]"
        >
          <CreateCompanyForm
            mode="create"
            onClose={() => setOpenCompanies(false)}
            onSuccess={async () => {
              setOpenCompanies(false);
              const res = await getAllActiveCompany();
              setCompanies(res.data || []);
            }}
          />
        </SlideOver>
      )}

      {openContacts && (
        <SlideOver
          open={openContacts}
          onClose={() => setOpenContact(false)}
          width="sm:w-[70vw] lg:w-[40vw]"
        >
          <CreateContactForm
            mode="create"
            onClose={() => setOpenContact(false)}
            onSuccess={async () => {
              setOpenContact(false);
              const res = await getAllActiveContacts();
              setContact(res.data || []);
            }}
          />
        </SlideOver>
      )}
    </div>
  );
}
