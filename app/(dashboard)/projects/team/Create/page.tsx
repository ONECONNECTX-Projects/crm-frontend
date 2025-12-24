"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function CreateTeamForm({ onClose }: Props) {
  const [project, setProject] = useState("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const projectOptions = ["test", "SC SZ", "Demo Project"];
  const memberOptions = ["Mr. Salesman", "Mrs. Manager", "Mrs. Delivery"];

  const toggleMember = (name: string) => {
    setMembers((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Create Team</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-6 space-y-5">
        {/* Project Name */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2">
            <span className="text-red-500">*</span> Project Name
            <span className="bg-blue-600 text-white rounded p-1">
              <Plus size={12} />
            </span>
          </label>

          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2 bg-white"
          >
            <option value="">Select Project</option>
            {projectOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Team Name */}
        <div>
          <label className="text-sm font-medium">Team Name</label>
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team Name"
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Team Members */}
        <div>
          <label className="text-sm font-medium">Team Members</label>

          <div className="mt-1 border rounded-md px-3 py-2 space-y-2">
            <div className="flex flex-wrap gap-2">
              {members.map((m) => (
                <span key={m} className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {m}
                </span>
              ))}
            </div>

            <select
              onChange={(e) => {
                toggleMember(e.target.value);
                e.target.value = "";
              }}
              className="w-full bg-white outline-none"
            >
              <option value="">Select Team Member/s</option>
              {memberOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => {
            console.log({ project, teamName, members });
            onClose();
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-medium mt-6"
        >
          Create Team
        </button>
      </div>
    </div>
  );
}
