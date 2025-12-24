"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface EmploymentStatusDetails {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data for demonstration
const mockEmploymentStatus: EmploymentStatusDetails = {
  id: 1,
  name: "Full Time",
  createdAt: "Jan 15, 2024",
  updatedAt: "Mar 10, 2024",
};

export default function ViewEmploymentStatusPage() {
  const router = useRouter();
  const params = useParams();
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatusDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setEmploymentStatus(mockEmploymentStatus);
      setLoading(false);
    }, 500);

    // In production, replace with actual API call:
    // fetch(`/api/employment-status/${params.id}`)
    //   .then((res) => res.json())
    //   .then((data) => setEmploymentStatus(data))
    //   .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white rounded-xl p-6">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!employmentStatus) {
    return (
      <div className="min-h-screen bg-white rounded-xl p-6">
        <p className="text-sm text-gray-500">Employment status not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Employment Status Details</h1>
            <p className="text-sm text-gray-500 mt-1">View employment status information</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/settings/employee-manage/employment-status")}
            >
              Back to List
            </Button>
            <Button onClick={() => router.push(`/settings/employee-manage/employment-status/${employmentStatus.id}/edit`)}>
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Are you sure you want to delete this employment status?")) {
                  console.log("Delete employment status");
                  router.push("/settings/employee-manage/employment-status");
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white border rounded-lg p-6">
          <div className="space-y-6">
            {/* Employment Status Name */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Employment Status Name
              </label>
              <p className="text-lg font-semibold text-gray-900">{employmentStatus.name}</p>
            </div>

            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Created Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Created Date
                  </label>
                  <p className="text-base text-gray-900">{employmentStatus.createdAt}</p>
                </div>

                {/* Last Updated */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Last Updated
                  </label>
                  <p className="text-base text-gray-900">{employmentStatus.updatedAt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}