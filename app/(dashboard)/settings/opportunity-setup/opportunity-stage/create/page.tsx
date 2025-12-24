"use client";

import { useEffect, useState } from "react";

interface Props {
  mode: "create" | "edit";
  OpportunityStageId: number | null;
  onClose: () => void;
}

export default function CreateOpportunityStageForm({
  mode,
  OpportunityStageId,
  onClose,
}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (mode === "edit" && OpportunityStageId) {
      // fetch by id (mock)
      setName("Private");
    }
  }, [mode, OpportunityStageId]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (mode === "edit") {
      console.log("UPDATE Opportunity Stage", { OpportunityStageId, name });
    } else {
      console.log("CREATE Opportunity Stage", { name });
    }

    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-semibold">
          {mode === "edit"
            ? "Edit Opportunity Stage"
            : "Create Opportunity Stage"}
        </h2>
        <button onClick={onClose} className="text-xl">
          ✕
        </button>
      </div>

      {/* Form */}
      <div>
        <label className="block font-medium mb-1">
          <span className="text-red-500">*</span> Opportunity Stage Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Opportunity Stage name"
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        {mode === "edit" ? "Update" : "Create"}
      </button>
    </div>
  );
}
