"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

export default function CreateOpportunity({
  onClose,
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);

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
            className={`h-full bg-blue-600 transition-all`}
            style={{ width: step === 2 ? "100%" : "0%" }}
          />
        </div>
        <Step active={step === 2} label="Addition Information" />
      </div>

      {step === 1 && <StepOne onNext={() => setStep(2)} />}
      {step === 2 && <StepTwo onBack={() => setStep(1)} onSubmit={onClose} />}
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
function StepOne({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Input label="* Name" />
        <Select label="Opportunity owner" options={["demo"]} />
        <Input label="Amount" />
        <Input label="Next step" />
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
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Select label="Company" plus options={["Company A"]} />
        <Select label="Contact" plus options={["Contact A"]} />
        <Input label="Competitors" />
        <Select label="Opportunity Type" plus options={["New Business"]} />
        <Select label="Opportunity Source" plus options={["Website"]} />
        <Select label="Opportunity Stage" plus options={["Prospect"]} />
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
function Input({ label }: { label: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input className="w-full mt-1 border rounded-md px-3 py-2" />
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

function Select({
  label,
  options,
  plus,
}: {
  label: string;
  options: string[];
  plus?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium">
        {label}
        {plus && <Plus size={14} className="text-blue-600" />}
      </label>
      <select className="w-full mt-1 border rounded-md px-3 py-2">
        <option>Select</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
