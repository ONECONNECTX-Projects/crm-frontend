"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/app/common/InputFeild";

interface CreateStaffFormProps {
  mode: "create" | "edit";
  staffId?: number | null;
  onClose: () => void;
}

/* ---------- FORM SHAPE ---------- */
const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  username: "",
  role: "",
  employeeId: "",
  department: "",
  designation: "",
  joiningDate: "",
  salary: "",
  address: "",
  city: "",
  state: "",
  country: "",
};

type TabKey = "basic" | "employment";

export default function CreateStaffForm({
  mode,
  staffId,
  onClose,
}: CreateStaffFormProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD DATA ON EDIT ---------- */
  // useEffect(() => {
  //   if (mode === "edit" && staffId) {
  //     setLoading(true);
  //     fetch(`/api/staff/${staffId}`)
  //       .then((res) => res.json())
  //       .then((data) => setForm({ ...initialForm, ...data }))
  //       .finally(() => setLoading(false));
  //   }
  // }, [mode, staffId]);

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
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit Staff" : "Create Staff"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 px-6 pt-4 border-b">
        <TabButton
          active={activeTab === "basic"}
          onClick={() => setActiveTab("basic")}
        >
          Basic Information
        </TabButton>
        <TabButton
          active={activeTab === "employment"}
          onClick={() => setActiveTab("employment")}
        >
          Employment Details
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
                <InputField
                  label="Staff Name *"
                  value={form.firstName}
                  noLeadingSpace
                  placeholder="Enter Staff Name"
                  onChange={(v) => setForm({ ...form, firstName: v })}
                ></InputField>
                <InputField
                  label="First name *"
                  noLeadingSpace
                  placeholder="Enter First Name"
                  value={form.firstName}
                  onChange={(v) => setForm({ ...form, firstName: v })}
                />
                <InputField
                  label="Last name"
                  value={form.lastName}
                  onChange={(v) => setForm({ ...form, lastName: v })}
                  noLeadingSpace
                  placeholder="Enter Last Name"
                />
                <InputField
                  label="Email *"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  noLeadingSpace
                  placeholder="Enter Email Address"
                />
                <InputField
                  label="Phone"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  noLeadingSpace
                  placeholder="Enter Phone Number"
                />
                <InputField
                  label="Username"
                  value={form.username}
                  onChange={(v) => setForm({ ...form, username: v })}
                  noLeadingSpace
                  placeholder="Enter Username"
                />
                <InputField
                  label="Role"
                  value={form.role}
                  onChange={(v) => setForm({ ...form, role: v })}
                  noLeadingSpace
                  placeholder="Enter Role"
                />
                <InputField
                  label="First name *"
                  value={form.firstName}
                  onChange={(v) => setForm({ ...form, firstName: v })}
                  noLeadingSpace
                  placeholder="Enter First Name"
                />
                <InputField
                  label="Last name"
                  value={form.lastName}
                  onChange={(v) => setForm({ ...form, lastName: v })}
                  noLeadingSpace
                  placeholder="Enter Last Name"
                />
                <InputField
                  label="Email *"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  noLeadingSpace
                  placeholder="Enter Email Address"
                />
                <InputField
                  label="Phone"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  noLeadingSpace
                  placeholder="Enter Phone Number"
                />
                <InputField
                  label="Username"
                  value={form.username}
                  onChange={(v) => setForm({ ...form, username: v })}
                  noLeadingSpace
                  placeholder="Enter Username"
                />
                <InputField
                  label="Role"
                  value={form.role}
                  onChange={(v) => setForm({ ...form, role: v })}
                  noLeadingSpace
                  placeholder="Enter Role"
                />
              </Grid>
            )}

            {/* EMPLOYMENT TAB */}
            {activeTab === "employment" && (
              <Grid>
                <InputField
                  label="Employee ID"
                  value={form.employeeId}
                  onChange={(v) => setForm({ ...form, employeeId: v })}
                  noLeadingSpace
                  placeholder="Enter Employee ID"
                />
                <InputField
                  label="Department"
                  value={form.department}
                  onChange={(v) => setForm({ ...form, department: v })}
                  noLeadingSpace
                  placeholder="Enter Department"
                />
                <InputField
                  label="Designation"
                  value={form.designation}
                  onChange={(v) => setForm({ ...form, designation: v })}
                  noLeadingSpace
                  placeholder="Enter Designation"
                />
                <InputField
                  label="Joining date"
                  value={form.joiningDate}
                  onChange={(v) => setForm({ ...form, joiningDate: v })}
                />
                <InputField
                  label="Salary"
                  value={form.salary}
                  onChange={(v) => setForm({ ...form, salary: v })}
                  noLeadingSpace
                  placeholder="Enter Salary"
                />
                <InputField
                  label="Address"
                  value={form.address}
                  onChange={(v) => setForm({ ...form, address: v })}
                  noLeadingSpace
                  placeholder="Enter Address"
                  multiline
                />
                <InputField
                  label="City"
                  value={form.city}
                  onChange={(v) => setForm({ ...form, city: v })}
                  noLeadingSpace
                  placeholder="Enter City"
                />
                <InputField
                  label="State"
                  value={form.state}
                  onChange={(v) => setForm({ ...form, state: v })}
                  noLeadingSpace
                  placeholder="Enter State"
                />
                <InputField
                  label="Country"
                  value={form.country}
                  onChange={(v) => setForm({ ...form, country: v })}
                  noLeadingSpace
                  placeholder="Enter Country"
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
            ? "border-blue-600 text-blue-600"
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
