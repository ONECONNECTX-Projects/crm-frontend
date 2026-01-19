import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Department {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all departments
export async function getAllDepartments(): Promise<ApiResponse<Department[]>> {
  const response = await api.get("departments");
  return response as unknown as ApiResponse<Department[]>;
}

// Create department
export async function createDepartment(
  data: Department
): Promise<ApiResponse<Department>> {
  return api.post("departments", data) as Promise<ApiResponse<Department>>;
}

// Update department
export async function updateDepartment(
  id: number,
  data: Department
): Promise<ApiResponse<Department>> {
  return api.put(`departments/${id}`, data) as Promise<ApiResponse<Department>>;
}

// Delete department
export async function deleteDepartment(id: number): Promise<ApiResponse<void>> {
  return api.delete(`departments/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveDepartment(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("departments/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateDepartmentStatus = (
  departmentId: number,
  isActive: boolean
) => {
  return api.patch(`departments/${departmentId}/status`, {
    is_active: isActive,
  });
};
