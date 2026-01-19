"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Staff,
  deleteStaff,
  getStaffById,
} from "@/app/services/staff/staff.service";
import { useError } from "@/app/providers/ErrorProvider";

export default function StaffViewPage() {
  const router = useRouter();
  const params = useParams();
  const { showSuccess, showError } = useError();
  const staffId = Number(params.id);
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);

  // Parse staff data from URL
  useEffect(() => {
    if (!staffId) return;

    const fetchStaff = async () => {
      try {
        setLoading(true);
        const res = await getStaffById(staffId);
        setStaff(res.data || null); // ← API response
      } catch (error) {
        console.error("Failed to fetch staff:", error);
        showError("Failed to fetch staff details");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [staffId, showError]);

  const handleDelete = async () => {
    if (!staff) return;

    if (
      window.confirm(`Are you sure you want to delete "${staff.user?.name}"?`)
    ) {
      try {
        await deleteStaff(staff.id);
        showSuccess("Staff deleted successfully");
        router.push("/staff");
      } catch (error) {
        console.error("Failed to delete staff:", error);
        showError("Failed to delete staff");
      }
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!staff) {
    return (
      <div className="p-10 text-center text-gray-500">Staff not found.</div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {staff.user?.name}
          </h1>
          <p className="text-gray-500">{staff.employee_code}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100"
          >
            Back
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Info Section */}
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold text-gray-800 mb-4 border-b pb-2">
            User Information
          </h2>
          <div className="space-y-3">
            <InfoRow label="Name" value={staff.user?.name} />
            <InfoRow label="Email" value={staff.user?.email} />
            <InfoRow label="Mobile" value={staff.user?.mobile} />
            <InfoRow label="Role" value={staff.user?.role?.name} />
          </div>
        </div>

        {/* Staff Info Section */}
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold text-gray-800 mb-4 border-b pb-2">
            Staff Information
          </h2>
          <div className="space-y-3">
            <InfoRow label="Employee Code" value={staff.employee_code} />
            <InfoRow
              label="Joining Date"
              value={
                staff.joining_date
                  ? new Date(staff.joining_date).toLocaleDateString()
                  : "-"
              }
            />
            <InfoRow label="Blood Group" value={staff.blood_group} />
            <InfoRow label="Department" value={staff.department?.name} />
            <InfoRow label="Designation" value={staff.designation?.name} />
            <InfoRow label="Shift" value={staff.shift?.name} />
            <InfoRow
              label="Employment Status"
              value={staff.employment_status?.name}
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold text-gray-800 mb-4 border-b pb-2">
            Address
          </h2>
          <div className="space-y-3">
            <InfoRow label="Street" value={staff.address?.street} />
            <InfoRow label="City" value={staff.address?.city} />
            <InfoRow label="State" value={staff.address?.state} />
            <InfoRow label="ZIP Code" value={staff.address?.zip_code} />
            <InfoRow label="Country" value={staff.address?.country} />
          </div>
        </div>

        {/* Salary Section */}
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold text-gray-800 mb-4 border-b pb-2">
            Salary Details
          </h2>
          <div className="space-y-3">
            <InfoRow
              label="Salary Amount"
              value={
                staff.designation_salaries?.salary_amount
                  ? `₹${staff.designation_salaries.salary_amount.toLocaleString()}`
                  : "-"
              }
            />
            <InfoRow
              label="Salary Type"
              value={staff.designation_salaries?.salary_type}
            />
            <InfoRow
              label="Commission Type"
              value={staff.designation_salaries?.commission_type}
            />
            <InfoRow
              label="Start Date"
              value={
                staff.designation_salaries?.start_date
                  ? new Date(
                      staff.designation_salaries.start_date
                    ).toLocaleDateString()
                  : "-"
              }
            />
          </div>
        </div>

        {/* Education Section */}
        {staff.educations && staff.educations.length > 0 && (
          <div className="border rounded-lg p-4 md:col-span-2">
            <h2 className="font-semibold text-gray-800 mb-4 border-b pb-2">
              Education
            </h2>
            <div className="space-y-4">
              {staff.educations.map((edu, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <div className="grid grid-cols-2 gap-2">
                    <InfoRow label="Degree" value={edu.degree} />
                    <InfoRow label="Institution" value={edu.institution} />
                    <InfoRow
                      label="Field of Study"
                      value={edu.field_of_study}
                    />
                    <InfoRow label="Result" value={edu.result} />
                    <InfoRow
                      label="Duration"
                      value={`${
                        edu.study_start_date
                          ? new Date(edu.study_start_date).toLocaleDateString()
                          : ""
                      } - ${
                        edu.study_end_date
                          ? new Date(edu.study_end_date).toLocaleDateString()
                          : ""
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500 text-sm">{label}:</span>
      <span className="text-gray-800 text-sm font-medium">{value || "-"}</span>
    </div>
  );
}
