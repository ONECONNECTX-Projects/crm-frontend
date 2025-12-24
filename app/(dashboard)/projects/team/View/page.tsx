"use client";

interface TeamViewProps {
  team: {
    project: string;
    members: { name: string }[];
  };
}

export default function TeamView({ team }: TeamViewProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Project Card */}
      <div className="border rounded-lg p-4">
        <p className="text-xs text-gray-500 uppercase">Project</p>
        <p className="text-lg font-semibold">{team.project}</p>
      </div>

      {/* Team Members */}
      <div className="border rounded-lg p-4">
        <p className="font-medium mb-4">Team Members</p>

        {team.members.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
            No team members found.
          </div>
        ) : (
          <div className="flex gap-4">
            {team.members.map((member, i) => (
              <MemberCard key={i} name={member.name} />
            ))}
          </div>
        )}
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
    .toUpperCase();

  return (
    <div className="border rounded-lg p-4 w-48 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-semibold">
        {initials}
      </div>
      <p className="mt-3 font-medium">{name}</p>
    </div>
  );
}
