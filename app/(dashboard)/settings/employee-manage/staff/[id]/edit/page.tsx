"use client";

import { useParams, useRouter } from "next/navigation";
import CreateStaffForm from "../../../components/page";

export default function EditStaffPage() {
  const params = useParams();
  const router = useRouter();

  const staffId = Number(params.id);

  return (
    <div className="min-h-screen bg-white rounded-xl">
      <CreateStaffForm
        mode="edit"
        staffId={staffId}
        onClose={() => router.push("/settings/employee-manage/staff")}
      />
    </div>
  );
}
