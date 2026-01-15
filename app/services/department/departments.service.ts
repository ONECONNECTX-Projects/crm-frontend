import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Department {
  id: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentsResponse {
  isSuccess: boolean;
  responseCode: number;
  AllDepartments: Department[];
}

export interface CreateDepartmentDto {
  name: string;
}

export interface UpdateDepartmentDto {
  name?: string;
}

// Get all departments
export async function getAllDepartments(): Promise<DepartmentsResponse> {
  const response = await api.get("departments");
  return response as unknown as DepartmentsResponse;
}

// Create department
export async function createDepartment(
  data: CreateDepartmentDto
): Promise<ApiResponse<Department>> {
  return api.post("departments", data) as Promise<ApiResponse<Department>>;
}

// Update department
export async function updateDepartment(
  id: number,
  data: UpdateDepartmentDto
): Promise<ApiResponse<Department>> {
  return api.put(`departments/${id}`, data) as Promise<ApiResponse<Department>>;
}

// Delete department
export async function deleteDepartment(id: number): Promise<ApiResponse<void>> {
  return api.delete(`departments/${id}`) as Promise<ApiResponse<void>>;
}
