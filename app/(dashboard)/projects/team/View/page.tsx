"use client";

import { ProjectTeam } from "@/app/services/project-teams/project-teams.service";
import { X } from "lucide-react";

interface TeamViewProps {
  team: ProjectTeam;
  onClose: () => void;
}

export default function TeamView({ team, onClose }: TeamViewProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Team Details</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Team Name Card */}
        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Team Name</p>
          <p className="text-lg font-semibold">{team.name}</p>
        </div>

        {/* Project Card */}
        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Project</p>
          <p className="text-lg font-semibold">{team.project?.name || "-"}</p>
        </div>

        {/* Status Card */}
        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Status</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              team.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {team.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Team Members */}
        <div className="border rounded-lg p-4">
          <p className="font-medium mb-4">Team Members</p>

          {!team.members || team.members.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
              No team members found.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {team.members.map((member, i) => (
                <MemberCard key={i} name={member.name} />
              ))}
            </div>
          )}
        </div>

        {/* Created Date */}
        <div className="border rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Created At</p>
          <p className="text-sm">
            {team.createdAt
              ? new Date(team.createdAt).toLocaleDateString()
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* Member Card */
function MemberCard({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="border rounded-lg p-4 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-semibold">
        {initials}
      </div>
      <p className="mt-3 font-medium">{name}</p>
    </div>
  );
}