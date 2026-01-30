"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CreateStaffFormProps {
  mode: "create" | "edit";
  staffId?: number | null;
  onClose: () => void;
}

/* ---------- FORM SHAPE ---------- */
const initialForm = {
  // Basic
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  username: "",
  role: "",

  // Address
  address: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",

  // Employment
  employeeId: "",
  department: "",
  joiningDate: "",
  leaveDate: "",
  shift: "",
  employeeStatus: "",

  // Designation & Salary
  designation: "",
  designationStartDate: "",
  designationEndDate: "",
  salary: "",
  salaryStartDate: "",
  salaryEndDate: "",
  salaryComment: "",
  commissionType: "",
  commissionValue: "",

  // Education
  education: [
    {
      institution: "",
      fieldOfStudy: "",
      result: "",
      startDate: "",
      endDate: "",
    },
  ],
};

type TabKey = "basic" | "address" | "employment" | "designation" | "education";

export default function CreateStaffForm({
  mode,
  staffId,
  onClose,
}: CreateStaffFormProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    const url = mode === "edit" ? `/api/staff/${staffId}` : "/api/staff";
    const method = mode === "edit" ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    onClose();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex gap-6 px-6 pt-4 border-b py-3 overflow-x-auto">
        {mode === "create" ? (
          <h1 className="text-xl font-semibold text-gray-900">Create Staff</h1>
        ) : (
          <h1 className="text-xl font-semibold text-gray-900">Edit Staff</h1>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 px-6 pt-4 border-b">
        <TabButton
          active={activeTab === "basic"}
          onClick={() => setActiveTab("basic")}
        >
          Basic
        </TabButton>
        <TabButton
          active={activeTab === "address"}
          onClick={() => setActiveTab("address")}
        >
          Address
        </TabButton>
        <TabButton
          active={activeTab === "employment"}
          onClick={() => setActiveTab("employment")}
        >
          Employment
        </TabButton>
        <TabButton
          active={activeTab === "designation"}
          onClick={() => setActiveTab("designation")}
        >
          Designation & Salary
        </TabButton>
        <TabButton
          active={activeTab === "education"}
          onClick={() => setActiveTab("education")}
        >
          Education
        </TabButton>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <>
            {/* BASIC INFO TAB */}
            {activeTab === "basic" && (
              <Grid>
                <Field
                  label="First name *"
                  value={form.firstName}
                  onChange={(v) => setForm({ ...form, firstName: v })}
                />
                <Field
                  label="Last name"
                  value={form.lastName}
                  onChange={(v) => setForm({ ...form, lastName: v })}
                />
                <Field
                  label="Email *"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                />
                <Field
                  label="Phone"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                />
                <Field
                  label="Username"
                  value={form.username}
                  onChange={(v) => setForm({ ...form, username: v })}
                />
                <Field
                  label="Role"
                  value={form.role}
                  onChange={(v) => setForm({ ...form, role: v })}
                />
              </Grid>
            )}

            {/* EMPLOYMENT TAB */}
            {activeTab === "employment" && (
              <Grid>
                <Field
                  label="Employee ID"
                  value={form.employeeId}
                  onChange={(v) => setForm({ ...form, employeeId: v })}
                />
                <Field
                  label="Department"
                  value={form.department}
                  onChange={(v) => setForm({ ...form, department: v })}
                />
                <Field
                  label="Designation"
                  value={form.designation}
                  onChange={(v) => setForm({ ...form, designation: v })}
                />
                <Field
                  label="Joining date"
                  value={form.joiningDate}
                  onChange={(v) => setForm({ ...form, joiningDate: v })}
                />
                <Field
                  label="Salary"
                  value={form.salary}
                  onChange={(v) => setForm({ ...form, salary: v })}
                />
                <Field
                  label="Address"
                  value={form.address}
                  onChange={(v) => setForm({ ...form, address: v })}
                />
                <Field
                  label="City"
                  value={form.city}
                  onChange={(v) => setForm({ ...form, city: v })}
                />
                <Field
                  label="State"
                  value={form.state}
                  onChange={(v) => setForm({ ...form, state: v })}
                />
                <Field
                  label="Country"
                  value={form.country}
                  onChange={(v) => setForm({ ...form, country: v })}
                />
              </Grid>
            )}

            {activeTab === "designation" && (
              <Grid>
                <Field
                  label="Designation"
                  value={form.designation}
                  onChange={(v) => setForm({ ...form, designation: v })}
                />
                <Field
                  label="Designation Start Date"
                  value={form.designationStartDate}
                  onChange={(v) =>
                    setForm({ ...form, designationStartDate: v })
                  }
                />
                <Field
                  label="Designation End Date"
                  value={form.designationEndDate}
                  onChange={(v) => setForm({ ...form, designationEndDate: v })}
                />

                <Field
                  label="Salary"
                  value={form.salary}
                  onChange={(v) => setForm({ ...form, salary: v })}
                />
                <Field
                  label="Salary Start Date"
                  value={form.salaryStartDate}
                  onChange={(v) => setForm({ ...form, salaryStartDate: v })}
                />
                <Field
                  label="Salary End Date"
                  value={form.salaryEndDate}
                  onChange={(v) => setForm({ ...form, salaryEndDate: v })}
                />

                <Field
                  label="Salary Comment"
                  value={form.salaryComment}
                  onChange={(v) => setForm({ ...form, salaryComment: v })}
                />
                <Field
                  label="Commission Type"
                  value={form.commissionType}
                  onChange={(v) => setForm({ ...form, commissionType: v })}
                />
                <Field
                  label="Commission Value"
                  value={form.commissionValue}
                  onChange={(v) => setForm({ ...form, commissionValue: v })}
                />
              </Grid>
            )}

            {activeTab === "education" && (
              <div className="space-y-6">
                {form.education?.map((edu, index) => (
                  <Grid key={index}>
                    <Field
                      label="Institution"
                      value={edu.institution}
                      onChange={(v) => {
                        const education = [...form.education];
                        education[index].institution = v;
                        setForm({ ...form, education });
                      }}
                    />
                    <Field
                      label="Field of Study"
                      value={edu.fieldOfStudy}
                      onChange={(v) => {
                        const education = [...form.education];
                        education[index].fieldOfStudy = v;
                        setForm({ ...form, education });
                      }}
                    />
                    <Field
                      label="Result"
                      value={edu.result}
                      onChange={(v) => {
                        const education = [...form.education];
                        education[index].result = v;
                        setForm({ ...form, education });
                      }}
                    />
                    <Field
                      label="Start Date"
                      value={edu.startDate}
                      onChange={(v) => {
                        const education = [...form.education];
                        education[index].startDate = v;
                        setForm({ ...form, education });
                      }}
                    />
                    <Field
                      label="End Date"
                      value={edu.endDate}
                      onChange={(v) => {
                        const education = [...form.education];
                        education[index].endDate = v;
                        setForm({ ...form, education });
                      }}
                    />
                  </Grid>
                ))}

                <Button
                  variant="outline"
                  onClick={() =>
                    setForm({
                      ...form,
                      education: [
                        ...form.education,
                        {
                          institution: "",
                          fieldOfStudy: "",
                          result: "",
                          startDate: "",
                          endDate: "",
                        },
                      ],
                    })
                  }
                >
                  + Add Education Information
                </Button>
              </div>
            )}

            {activeTab === "address" && (
              <Grid>
                <Field
                  label="Address"
                  value={form.address}
                  onChange={(v) => setForm({ ...form, address: v })}
                />
                <Field
                  label="City"
                  value={form.city}
                  onChange={(v) => setForm({ ...form, city: v })}
                />
                <Field
                  label="State"
                  value={form.state}
                  onChange={(v) => setForm({ ...form, state: v })}
                />
                <Field
                  label="Zip Code"
                  value={form.zipCode}
                  onChange={(v) => setForm({ ...form, zipCode: v })}
                />
                <Field
                  label="Country"
                  value={form.country}
                  onChange={(v) => setForm({ ...form, country: v })}
                />
              </Grid>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end px-6 py-4 border-t">
        <Button onClick={handleSubmit}>
          {mode === "edit" ? "Update Staff" : "Create Staff"}
        </Button>
      </div>
    </div>
  );
}

/* ---------- HELPERS ---------- */

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 text-sm font-medium border-b-2 transition
        ${
          active
            ? "border-brand-500 text-brand-500"
            : "border-transparent text-gray-500 hover:text-gray-700"
        }`}
    >
      {children}
    </button>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}
