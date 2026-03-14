"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";
import { getAllActiveRoles } from "@/app/services/roles/roles.service";
import { getAllActiveDepartment } from "@/app/services/department/departments.service";
import { getAllActiveDesignation } from "@/app/services/designation/designation.service";
import { getAllActiveShift } from "@/app/services/shift/shifts.service";
import { getAllActiveEmploymentStatus } from "@/app/services/employment-statuses/employment-statuses.service";
import {
  createStaff,
  updateStaff,
  Staff,
  StaffPayload,
  StaffEducation,
} from "@/app/services/staff/staff.service";
import { useError } from "@/app/providers/ErrorProvider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateDepartmentForm from "../../departments/create/page";
import CreateDesignationForm from "../../designations/create/page";
import CreateShiftForm from "../../shifts/create/page";
import CreateEmploymentStatusForm from "../../employment-status/create/page";

interface CreateStaffFormProps {
  mode?: "create" | "edit";
  data?: Staff;
  onClose: () => void;
  onSuccess?: () => void;
}

const bloodGroups = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

const salaryTypes = [
  { label: "Monthly", value: "monthly" },
  { label: "Weekly", value: "weekly" },
  { label: "Daily", value: "daily" },
  { label: "Hourly", value: "hourly" },
];

const commissionTypes = [
  { label: "None", value: "none" },
  { label: "Fixed", value: "fixed" },
  { label: "Percentage", value: "percentage" },
];

export default function CreateStaffForm({
  mode = "create",
  data,
  onClose,
  onSuccess,
}: CreateStaffFormProps) {
  const { showSuccess, showError } = useError();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Quick-create modals
  const [openDepartmentModal, setOpenDepartmentModal] = useState(false);
  const [openDesignationModal, setOpenDesignationModal] = useState(false);
  const [openShiftModal, setOpenShiftModal] = useState(false);
  const [openEmploymentStatusModal, setOpenEmploymentStatusModal] = useState(false);

  // Dropdown options
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([]);
  const [designations, setDesignations] = useState<
    { id: number; name: string }[]
  >([]);
  const [shifts, setShifts] = useState<{ id: number; name: string }[]>([]);
  const [employmentStatuses, setEmploymentStatuses] = useState<
    { id: number; name: string }[]
  >([]);

  // Form data
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role_id: "",
  });

  const [staffForm, setStaffForm] = useState({
    employee_code: "",
    joining_date: "",
    blood_group: "",
    department_id: "",
    designation_id: "",
    shift_id: "",
    employment_status_id: "",
  });

  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  });

  const [educations, setEducations] = useState<StaffEducation[]>([
    {
      degree: "",
      institution: "",
      field_of_study: "",
      result: "",
      study_start_date: "",
      study_end_date: "",
    },
  ]);

  const [salaryForm, setSalaryForm] = useState({
    designation_id: "",
    salary_amount: "",
    salary_type: "monthly",
    commission_type: "none",
    start_date: "",
  });

  // Set form data when editing
  useEffect(() => {
    if (mode === "edit" && data) {
      setUserForm({
        name: data.user?.name || "",
        email: data.user?.email || "",
        mobile: data.user?.mobile || "",
        password: "",
        role_id: data.user?.role_id?.toString() || "",
      });

      setStaffForm({
        employee_code: data.employee_code || "",
        joining_date: data.joining_date?.split("T")[0] || "",
        blood_group: data.blood_group || "",
        department_id: data.department_id?.toString() || "",
        designation_id: data.designation_id?.toString() || "",
        shift_id: data.shift_id?.toString() || "",
        employment_status_id: data.employment_status_id?.toString() || "",
      });

      if (data.address) {
        setAddressForm({
          street: data.address.street || "",
          city: data.address.city || "",
          state: data.address.state || "",
          zip_code: data.address.zip_code || "",
          country: data.address.country || "",
        });
      }

      if (data.educations && data.educations.length > 0) {
        setEducations(
          data.educations.map((edu) => ({
            ...edu,
            study_start_date: edu.study_start_date?.split("T")[0] || "",
            study_end_date: edu.study_end_date?.split("T")[0] || "",
          })),
        );
      }

      if (data.designation_salaries) {
        setSalaryForm({
          designation_id:
            data.designation_salaries.designation_id?.toString() || "",
          salary_amount:
            data.designation_salaries.salary_amount?.toString() || "",
          salary_type: data.designation_salaries.salary_type || "monthly",
          commission_type: data.designation_salaries.commission_type || "none",
          start_date: data.designation_salaries.start_date?.split("T")[0] || "",
        });
      }
    }
  }, [mode, data]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoading(true);
      try {
        const [rolesRes, deptsRes, desigsRes, shiftsRes, empStatusRes] =
          await Promise.all([
            getAllActiveRoles(),
            getAllActiveDepartment(),
            getAllActiveDesignation(),
            getAllActiveShift(),
            getAllActiveEmploymentStatus(),
          ]);

        setRoles(rolesRes.data || []);
        setDepartments(deptsRes.data || []);
        setDesignations(desigsRes.data || []);
        setShifts(shiftsRes.data || []);
        setEmploymentStatuses(empStatusRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        degree: "",
        institution: "",
        field_of_study: "",
        result: "",
        study_start_date: "",
        study_end_date: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    if (educations.length > 1) {
      setEducations(educations.filter((_, i) => i !== index));
    }
  };

  const updateEducation = (
    index: number,
    field: keyof StaffEducation,
    value: string,
  ) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTab(0)) {
      setActiveTab(0);
      return;
    }
    if (!validateTab(1)) {
      setActiveTab(1);
      return;
    }

    setSubmitting(true);
    try {
      const payload: StaffPayload = {
        user: {
          name: userForm.name,
          email: userForm.email,
          mobile: userForm.mobile,
          password: userForm.password || undefined,
          role_id: parseInt(userForm.role_id),
        },
        staff: {
          employee_code: staffForm.employee_code,
          joining_date: staffForm.joining_date,
          blood_group: staffForm.blood_group,
          department_id: parseInt(staffForm.department_id),
          designation_id: parseInt(staffForm.designation_id),
          shift_id: parseInt(staffForm.shift_id),
          employment_status_id: parseInt(staffForm.employment_status_id),
        },
        address: addressForm,
        educations: educations.filter((edu) => edu.degree || edu.institution),
        designation_salary: {
          designation_id:
            parseInt(salaryForm.designation_id) ||
            parseInt(staffForm.designation_id),
          salary_amount: parseFloat(salaryForm.salary_amount) || 0,
          salary_type: salaryForm.salary_type,
          commission_type: salaryForm.commission_type,
          start_date: salaryForm.start_date || null,
        },
      };

      if (mode === "edit" && data?.id) {
        await updateStaff(data.id, payload);
        showSuccess("Staff updated successfully");
      } else {
        await createStaff(payload);
        showSuccess("Staff created successfully");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to save staff:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const validateTab = (tabIndex: number): boolean => {
    if (tabIndex === 0) {
      if (!userForm.name.trim()) {
        showError("Name is required");
        return false;
      }
      if (!userForm.email.trim()) {
        showError("Email is required");
        return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(userForm.email)) {
        showError("Invalid email format");
        return false;
      }
      if (!userForm.mobile.trim()) {
        showError("Mobile is required");
        return false;
      }
      if (mode === "create" && !userForm.password.trim()) {
        showError("Password is required");
        return false;
      }
      if (mode === "create" && userForm.password.trim().length < 6) {
        showError("Password must be at least 6 characters");
        return false;
      }
      if (!userForm.role_id) {
        showError("Role is required");
        return false;
      }
    }
    if (tabIndex === 1) {
      if (!staffForm.employee_code.trim()) {
        showError("Employee Code is required");
        return false;
      }
      if (!staffForm.joining_date) {
        showError("Joining Date is required");
        return false;
      }
      if (!staffForm.department_id) {
        showError("Department is required");
        return false;
      }
      if (!staffForm.designation_id) {
        showError("Designation is required");
        return false;
      }
      if (!staffForm.shift_id) {
        showError("Shift is required");
        return false;
      }
      if (!staffForm.employment_status_id) {
        showError("Employment Status is required");
        return false;
      }
    }
    return true;
  };

  const tabs = [
    { label: "User Info", key: "user" },
    { label: "Staff Info", key: "staff" },
    { label: "Address", key: "address" },
    { label: "Education", key: "education" },
    { label: "Salary", key: "salary" },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {mode === "edit" ? "Edit Staff" : "Add Staff"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            onClick={() => {
              if (index > activeTab) {
                for (let i = activeTab; i < index; i++) {
                  if (!validateTab(i)) return;
                }
              }
              setActiveTab(index);
            }}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === index
                ? "border-b-2 border-brand-500 text-brand-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* User Info Tab */}
        {activeTab === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <InputField
                type="text"
                label="Full Name"
                required
                value={userForm.name}
                onChange={(v) => setUserForm({ ...userForm, name: v })}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <InputField
                type="email"
                label="Email"
                required
                value={userForm.email}
                onChange={(v) => setUserForm({ ...userForm, email: v })}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <InputField
                type="text"
                label="Mobile"
                required
                maxLength={10}
                value={userForm.mobile}
                onChange={(v) => setUserForm({ ...userForm, mobile: v })}
                placeholder="Enter mobile number"
              />
            </div>
            <div>
              <InputField
                type="password"
                label={
                  mode === "create"
                    ? "Password"
                    : "Password (leave blank to keep)"
                }
                required={mode === "create"}
                value={userForm.password}
                onChange={(v) => setUserForm({ ...userForm, password: v })}
                placeholder="Enter password"
              />
            </div>
            <div>
              <SelectDropdown
                label="Role"
                required
                value={userForm.role_id}
                onChange={(v) => setUserForm({ ...userForm, role_id: v })}
                options={roles.map((role) => ({
                  label: role.name,
                  value: role.id,
                }))}
                placeholder="Select Role"
              />
            </div>
          </div>
        )}

        {/* Staff Info Tab */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <InputField
                type="text"
                label="Employee Code"
                required
                value={staffForm.employee_code}
                onChange={(v) =>
                  setStaffForm({ ...staffForm, employee_code: v })
                }
                placeholder="Enter employee code"
              />
            </div>
            <div>
              <InputField
                type="date"
                label="Joining Date"
                required
                value={staffForm.joining_date}
                onChange={(v) =>
                  setStaffForm({ ...staffForm, joining_date: v })
                }
                placeholder="Select joining date"
              />
            </div>
            <div>
              <SelectDropdown
                label="Blood Group"
                value={staffForm.blood_group}
                onChange={(v) => setStaffForm({ ...staffForm, blood_group: v })}
                options={bloodGroups}
                placeholder="Select Blood Group"
              />
            </div>
            <div>
              <SelectDropdown
                label="Department"
                required
                value={staffForm.department_id}
                onChange={(v) =>
                  setStaffForm({ ...staffForm, department_id: v })
                }
                options={departments.map((dept) => ({
                  label: dept.name,
                  value: dept.id,
                }))}
                onAddClick={() => setOpenDepartmentModal(true)}
                placeholder="Select Department"
              />
            </div>
            <div>
              <SelectDropdown
                label="Designation"
                required
                value={staffForm.designation_id}
                onChange={(v) => {
                  setStaffForm({ ...staffForm, designation_id: v });
                  setSalaryForm({ ...salaryForm, designation_id: v });
                }}
                options={designations.map((desig) => ({
                  label: desig.name,
                  value: desig.id,
                }))}
                onAddClick={() => setOpenDesignationModal(true)}
                placeholder="Select Designation"
              />
            </div>
            <div>
              <SelectDropdown
                label="Shift"
                required
                value={staffForm.shift_id}
                onChange={(v) => setStaffForm({ ...staffForm, shift_id: v })}
                options={shifts.map((shift) => ({
                  label: shift.name,
                  value: shift.id,
                }))}
                onAddClick={() => setOpenShiftModal(true)}
                placeholder="Select Shift"
              />
            </div>
            <div>
              <SelectDropdown
                label="Employment Status"
                required
                value={staffForm.employment_status_id}
                onChange={(v) =>
                  setStaffForm({ ...staffForm, employment_status_id: v })
                }
                options={employmentStatuses.map((status) => ({
                  label: status.name,
                  value: status.id,
                }))}
                onAddClick={() => setOpenEmploymentStatusModal(true)}
                placeholder="Select Employment Status"
              />
            </div>
          </div>
        )}

        {/* Address Tab */}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <InputField
                type="text"
                label="Street Address"
                value={addressForm.street}
                onChange={(v) => setAddressForm({ ...addressForm, street: v })}
                placeholder="Enter street address"
              />
            </div>
            <div>
              <InputField
                type="text"
                label="City"
                value={addressForm.city}
                onChange={(v) => setAddressForm({ ...addressForm, city: v })}
                placeholder="Enter city"
              />
            </div>
            <div>
              <InputField
                type="text"
                label="State"
                value={addressForm.state}
                onChange={(v) => setAddressForm({ ...addressForm, state: v })}
                placeholder="Enter state"
              />
            </div>
            <div>
              <InputField
                type="text"
                label="ZIP Code"
                value={addressForm.zip_code}
                onChange={(v) =>
                  setAddressForm({ ...addressForm, zip_code: v })
                }
                placeholder="Enter ZIP code"
              />
            </div>
            <div>
              <InputField
                type="text"
                label="Country"
                value={addressForm.country}
                onChange={(v) => setAddressForm({ ...addressForm, country: v })}
                placeholder="Enter country"
              />
            </div>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 3 && (
          <div className="space-y-6">
            {educations.map((edu, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">
                    Education {index + 1}
                  </h3>
                  {educations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputField
                      type="text"
                      label="Degree"
                      value={edu.degree}
                      onChange={(v) => updateEducation(index, "degree", v)}
                      placeholder="e.g., BCA, MBA"
                    />
                  </div>
                  <div>
                    <InputField
                      type="text"
                      label="Institution"
                      value={edu.institution}
                      onChange={(v) => updateEducation(index, "institution", v)}
                      placeholder="Enter institution name"
                    />
                  </div>
                  <div>
                    <InputField
                      type="text"
                      label="Field of Study"
                      value={edu.field_of_study}
                      onChange={(v) =>
                        updateEducation(index, "field_of_study", v)
                      }
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div>
                    <InputField
                      type="text"
                      label="Result"
                      value={edu.result}
                      onChange={(v) => updateEducation(index, "result", v)}
                      placeholder="e.g., 7.5 CGPA"
                    />
                  </div>
                  <div>
                    <InputField
                      type="date"
                      label="Start Date"
                      value={edu.study_start_date}
                      onChange={(v) =>
                        updateEducation(index, "study_start_date", v)
                      }
                      placeholder="Select start date"
                    />
                  </div>
                  <div>
                    <InputField
                      type="date"
                      label="End Date"
                      value={edu.study_end_date}
                      onChange={(v) =>
                        updateEducation(index, "study_end_date", v)
                      }
                      placeholder="Select end date"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="flex items-center gap-2 text-brand-500 hover:text-brand-500"
            >
              <Plus size={18} />
              Add Education
            </button>
          </div>
        )}

        {/* Salary Tab */}
        {activeTab === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <InputField
                type="number"
                label="Salary Amount"
                value={salaryForm.salary_amount}
                onChange={(v) =>
                  setSalaryForm({ ...salaryForm, salary_amount: v })
                }
                placeholder="Enter salary amount"
              />
            </div>
            <div>
              <SelectDropdown
                label="Salary Type"
                value={salaryForm.salary_type}
                onChange={(v) =>
                  setSalaryForm({ ...salaryForm, salary_type: v })
                }
                options={salaryTypes}
                placeholder="Select Salary Type"
              />
            </div>
            <div>
              <SelectDropdown
                label="Commission Type"
                value={salaryForm.commission_type}
                onChange={(v) =>
                  setSalaryForm({ ...salaryForm, commission_type: v })
                }
                options={commissionTypes}
                placeholder="Select Commission Type"
              />
            </div>
            <div>
              <InputField
                type="date"
                label="Start Date"
                value={salaryForm.start_date}
                onChange={(v) =>
                  setSalaryForm({ ...salaryForm, start_date: v })
                }
                placeholder="Select start date"
              />
            </div>
          </div>
        )}

        {/* Navigation and Submit */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <div>
            {activeTab > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab(activeTab - 1)}
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {activeTab < tabs.length - 1 ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (!validateTab(activeTab)) return;
                  setActiveTab(activeTab + 1);
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={submitting}
                className="bg-brand-500 text-white hover:bg-brand-600"
              >
                {submitting
                  ? "Saving..."
                  : mode === "edit"
                    ? "Update Staff"
                    : "Create Staff"}
              </Button>
            )}
          </div>
        </div>
      </form>

      {openDepartmentModal && (
        <Dialog open={openDepartmentModal} onOpenChange={setOpenDepartmentModal}>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <CreateDepartmentForm
              mode="create"
              onClose={() => setOpenDepartmentModal(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenDepartmentModal(false);
                const res = await getAllActiveDepartment();
                setDepartments(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {openDesignationModal && (
        <Dialog open={openDesignationModal} onOpenChange={setOpenDesignationModal}>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <CreateDesignationForm
              mode="create"
              onClose={() => setOpenDesignationModal(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenDesignationModal(false);
                const res = await getAllActiveDesignation();
                setDesignations(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {openShiftModal && (
        <Dialog open={openShiftModal} onOpenChange={setOpenShiftModal}>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <CreateShiftForm
              mode="create"
              onClose={() => setOpenShiftModal(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenShiftModal(false);
                const res = await getAllActiveShift();
                setShifts(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {openEmploymentStatusModal && (
        <Dialog open={openEmploymentStatusModal} onOpenChange={setOpenEmploymentStatusModal}>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <CreateEmploymentStatusForm
              mode="create"
              onClose={() => setOpenEmploymentStatusModal(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenEmploymentStatusModal(false);
                const res = await getAllActiveEmploymentStatus();
                setEmploymentStatuses(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
