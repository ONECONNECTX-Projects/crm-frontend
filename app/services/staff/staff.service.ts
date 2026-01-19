import { api, ApiResponse } from "@/app/utils/apiClient";

// User section
export interface StaffUser {
  name: string;
  email: string;
  mobile: string;
  password?: string;
  role_id: number;
}

// Staff section
export interface StaffInfo {
  employee_code: string;
  joining_date: string;
  blood_group: string;
  department_id: number;
  designation_id: number;
  shift_id: number;
  employment_status_id: number;
}

// Address section
export interface StaffAddress {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

// Education section
export interface StaffEducation {
  id?: number;
  degree: string;
  institution: string;
  field_of_study: string;
  result: string;
  study_start_date: string;
  study_end_date: string;
}

// Designation Salary section
export interface DesignationSalary {
  designation_id: number;
  salary_amount: number;
  salary_type: string;
  commission_type: string;
  start_date: string;
}

// Complete Staff Create/Update payload
export interface StaffPayload {
  user: StaffUser;
  staff: StaffInfo;
  address: StaffAddress;
  educations: StaffEducation[];
  designation_salary: DesignationSalary;
}

// Staff response from API (with all relations)
export interface Staff {
  id: number;
  user_id: number;
  employee_code: string;
  joining_date: string;
  blood_group: string;
  department_id: number;
  designation_id: number;
  shift_id: number;
  employment_status_id: number;
  is_active: boolean;
  is_delete: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    mobile: string;
    role_id: number;
    role?: {
      id: number;
      name: string;
    };
  };
  department?: {
    id: number;
    name: string;
  };
  designation?: {
    id: number;
    name: string;
  };
  shift?: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
  };
  employment_status?: {
    id: number;
    name: string;
  };
  address?: StaffAddress;
  educations?: StaffEducation[];
  designation_salaries?: DesignationSalary;
}

// Get all staff
export async function getAllStaff(): Promise<ApiResponse<Staff[]>> {
  const response = await api.get("staff");
  return response as unknown as ApiResponse<Staff[]>;
}

// Get staff by ID
export async function getStaffById(id: number): Promise<ApiResponse<Staff>> {
  const response = await api.get(`staff/${id}`);
  return response as unknown as ApiResponse<Staff>;
}

// Create Staff
export async function createStaff(
  data: StaffPayload
): Promise<ApiResponse<Staff>> {
  return api.post("staff", data) as Promise<ApiResponse<Staff>>;
}

// Update Staff
export async function updateStaff(
  id: number,
  data: StaffPayload
): Promise<ApiResponse<Staff>> {
  return api.put(`staff/${id}`, data) as Promise<ApiResponse<Staff>>;
}

// Delete Staff
export async function deleteStaff(id: number): Promise<ApiResponse<void>> {
  return api.delete(`staff/${id}`) as Promise<ApiResponse<void>>;
}

export const updateStaffStatus = (staffId: number, isActive: boolean) => {
  return api.patch(`staff/${staffId}/status`, {
    is_active: isActive,
  });
};
