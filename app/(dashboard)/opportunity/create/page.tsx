"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";
import { label } from "framer-motion/client";

type OpportunityForm = {
  name: string;
  amount: string;
  nextStep: string;
  competitors: string;
};

type ChangeHandler = (field: keyof OpportunityForm) => (value: string) => void;
export default function CreateOpportunity({
  onClose,
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<OpportunityForm>({
    name: "",
    amount: "",
    nextStep: "",
    competitors: "",
  });

  const handleChange = (field: keyof OpportunityForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Final Form Data 👉", form);
    onClose();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg font-semibold">Create Opportunity</h2>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between my-6">
        <Step active={step >= 1} label="Opportunity Information" />
        <div className="flex-1 h-[2px] bg-gray-200 mx-4">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: step === 2 ? "100%" : "0%" }}
          />
        </div>
        <Step active={step === 2} label="Additional Information" />
      </div>

      {step === 1 && (
        <StepOne
          form={form}
          onChange={handleChange}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepTwo
          form={form}
          onChange={handleChange}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function Step({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm
        ${active ? "bg-blue-600 text-white" : "bg-gray-200"}`}
      >
        ✓
      </div>
      <span className={active ? "text-black" : "text-gray-400"}>{label}</span>
    </div>
  );
}

function StepOne({
  form,
  onChange,
  onNext,
}: {
  form: OpportunityForm;
  onChange: ChangeHandler;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <InputField
          label="Name"
          placeholder="Enter you Name"
          value={form.name}
          onChange={onChange("name")}
        />

        <SelectDropdown
          label="Opportunity owner"
          options={[
            { label: "Owner 1", value: "owner1" },
            { label: "Owner 2", value: "owner2" },
          ]}
        />

        <InputField
          label="Amount"
          placeholder="Enter Amount"
          value={form.amount}
          onChange={onChange("amount")}
        />

        <InputField
          label="Next step"
          value={form.nextStep}
          onChange={onChange("nextStep")}
        />

        <DateInput label="Opportunity create date" />
        <DateInput label="Opportunity Close Date" />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function StepTwo({
  form,
  onChange,
  onBack,
  onSubmit,
}: {
  form: OpportunityForm;
  onChange: ChangeHandler;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <SelectDropdown
          label="Company"
          options={[
            { label: "Owner 1", value: "owner1" },
            { label: "Owner 2", value: "owner2" },
          ]}
        />
        <SelectDropdown
          label="Contact"
          options={[
            { label: "Owner 1", value: "owner1" },
            { label: "Owner 2", value: "owner2" },
          ]}
        />

        <InputField
          label="Competitors"
          placeholder="Enter Competitors"
          value={form.competitors}
          onChange={onChange("competitors")}
        />

        <SelectDropdown
          label="Opportunity Type"
          options={[
            { label: "Owner 1", value: "owner1" },
            { label: "Owner 2", value: "owner2" },
          ]}
        />
        <SelectDropdown
          label="Opportunity Source"
          options={[
            { label: "Owner 1", value: "owner1" },
            { label: "Owner 2", value: "owner2" },
          ]}
        />
        <SelectDropdown
          label="Opportunity Stage"
          options={[
            { label: "Owner 1", value: "owner1" },
            { label: "Owner 2", value: "owner2" },
          ]}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          rows={4}
          className="w-full mt-1 border rounded-md px-3 py-2"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onBack} className="border px-6 py-2 rounded-md">
          Previous
        </button>
        <button
          onClick={onSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
function DateInput({ label }: { label: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input type="date" className="w-full mt-1 border rounded-md px-3 py-2" />
    </div>
  );
}
