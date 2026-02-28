"use client";

import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import {
  createProjectTeam,
  ProjectTeamPayload,
} from "@/app/services/project-teams/project-teams.service";
import { getAllActiveProjects } from "@/app/services/project/project.service";
import { getAllStaff, Staff } from "@/app/services/staff/staff.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { useError } from "@/app/providers/ErrorProvider";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTeamForm({ onClose, onSuccess }: Props) {
  const { showSuccess, showError } = useError();

  const [projectId, setProjectId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [memberIds, setMemberIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState<OptionDropDownModel[]>([]);
  const [members, setMembers] = useState<{ id: number; name: string }[]>([]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [projectsRes, staffRes] = await Promise.all([
          getAllActiveProjects(),
          getAllStaff(),
        ]);

        setProjects(projectsRes.data || []);
        const staffList = staffRes.data || [];
        setMembers(
          staffList.map((s: Staff) => ({
            id: s.user_id,
            name: s.user?.name || "",
          })),
        );
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const toggleMember = (id: number) => {
    setMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const removeMember = (id: number) => {
    setMemberIds((prev) => prev.filter((m) => m !== id));
  };

  const getSelectedMemberNames = () => {
    return memberIds
      .map((id) => members.find((m) => m.id === id)?.name)
      .filter(Boolean);
  };

  const handleSubmit = async () => {
    if (!projectId) {
      showError("Please select a project");
      return;
    }
    if (!teamName.trim()) {
      showError("Please enter a team name");
      return;
    }

    setLoading(true);
    try {
      const payload: ProjectTeamPayload = {
        project_id: parseInt(projectId),
        name: teamName,
        member_ids: memberIds,
      };

      await createProjectTeam(payload);
      showSuccess("Team created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create team:", error);
      showError("Failed to create team");
    } finally {
      setLoading(false);
    }
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
          </label>

          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2 bg-white"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Team Name */}
        <div>
          <label className="text-sm font-medium">
            <span className="text-red-500">*</span> Team Name
          </label>
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team Name"
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Team Members - Multi Select */}
        <div>
          <label className="text-sm font-medium">Team Members</label>

          <div className="border rounded-md px-2 py-1 flex flex-wrap items-center gap-2 min-h-[42px]">
            {/* Selected Members */}
            {memberIds.map((id) => {
              const member = members.find((m) => m.id === id);
              if (!member) return null;

              return (
                <span
                  key={id}
                  className="bg-brand-100 text-brand-600 px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  {member.name}
                  <button
                    type="button"
                    onClick={() => removeMember(id)}
                    className="hover:text-brand-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              );
            })}

            {/* Dropdown only */}
            <select
              onChange={(e) => {
                const id = Number(e.target.value);
                if (id && !memberIds.includes(id)) {
                  toggleMember(id);
                }
                e.target.value = "";
              }}
              className="flex-1 min-w-[40px] bg-transparent outline-none"
            >
              <option value="">
                {memberIds.length == 0 ? "Select Members" : ""}
              </option>

              {members
                .filter((m) => !memberIds.includes(m.id))
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-brand-500 text-white py-3 rounded-md font-medium mt-6 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Team"}
        </button>
      </div>
    </div>
  );
}
