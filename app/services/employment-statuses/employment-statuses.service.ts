import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface EmploymentStatus {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getAllEmploymentStatus(): Promise<
  ApiResponse<EmploymentStatus[]>
> {
  const response = await api.get("employment-statuses");
  return response as unknown as ApiResponse<EmploymentStatus[]>;
}

// Create EmploymentStatus
export async function createEmploymentStatus(
  data: EmploymentStatus
): Promise<ApiResponse<EmploymentStatus>> {
  return api.post("employment-statuses", data) as Promise<
    ApiResponse<EmploymentStatus>
  >;
}

// Update EmploymentStatus
export async function updateEmploymentStatus(
  id: number,
  data: EmploymentStatus
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

export async function getAllActiveEmploymentStatus(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("employment-statuses/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateEmploymentStatusStatus = (
  employmentStatusId: number,
  isActive: boolean
) => {
  return api.patch(`employment-statuses/${employmentStatusId}/status`, {
    is_active: isActive,
  });
};
