import { api, ApiResponse } from "@/app/utils/apiClient";

export interface EmploymentStatus {
  id: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EmploymentStatusResponse {
  isSuccess: boolean;
  responseCode: number;
  AllEmploymentStatuses: EmploymentStatus[];
}

export interface CreateEmploymentStatusDto {
  name: string;
}

export interface UpdateEmploymentStatusDto {
  name?: string;
}

export async function getAllEmploymentStatus(): Promise<EmploymentStatusResponse> {
  const response = await api.get("employment-statuses");
  return response as unknown as EmploymentStatusResponse;
}

// Create EmploymentStatus
export async function createEmploymentStatus(
  data: CreateEmploymentStatusDto
): Promise<ApiResponse<EmploymentStatus>> {
  return api.post("employment-statuses", data) as Promise<
    ApiResponse<EmploymentStatus>
  >;
}

// Update EmploymentStatus
export async function updateEmploymentStatus(
  id: number,
  data: UpdateEmploymentStatusDto
): Promise<ApiResponse<EmploymentStatus>> {
  return api.put(`employment-statuses/${id}`, data) as Promise<
    ApiResponse<EmploymentStatus>
  >;
}

// Delete EmploymentStatus
export async function deleteEmploymentStatus(
  id: number
): Promise<ApiResponse<void>> {
  return api.delete(`employment-statuses/${id}`) as Promise<ApiResponse<void>>;
}
