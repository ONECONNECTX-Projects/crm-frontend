"use client";

import { useRouter } from "next/navigation";
import CreateStaffForm from "../../components/page";

export default function CreateStaffPage() {
  const router = useRouter();

  return (
    <CreateStaffForm
      mode="create"
      onClose={() => {
        router.push("/settings/employee-manage/staff");
      }}
    />
  );
}
