"use client";

import { useParams, useRouter } from "next/navigation";
import CreateRoleForm from "../../create/page";

export default function EditRolePage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id ? parseInt(params.id as string) : null;

  return (
    <div className="min-h-screen bg-white rounded-lg sm:rounded-xl">
      <CreateRoleForm
        mode="edit"
        roleId={roleId}
        onClose={() => router.push("/settings/employee-manage/roles")}
      />
    </div>
  );
}