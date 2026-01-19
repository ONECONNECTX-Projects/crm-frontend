import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface LeadStatus {
  id?: number;
  name: string;
  color?: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Get all LeadStatus
export async function getAllLeadStatus(): Promise<ApiResponse<LeadStatus[]>> {
  const response = await api.get("lead-statuses");
  return response as unknown as ApiResponse<LeadStatus[]>;
}

// Create LeadStatus
export async function createLeadStatus(
  data: LeadStatus
): Promise<ApiResponse<LeadStatus>> {
  return api.post("lead-statuses", data) as Promise<ApiResponse<LeadStatus>>;
}

// Update LeadStatus
export async function updateLeadStatus(
  id: number,
  data: LeadStatus
): Promise<ApiResponse<LeadStatus>> {
  return api.put(`lead-statuses/${id}`, data) as Promise<
    ApiResponse<LeadStatus>
  >;
}

// Delete LeadStatus
export async function deleteLeadStatus(id: number): Promise<ApiResponse<void>> {
  return api.delete(`lead-statuses/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveLeadStatuses(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("lead-statuses/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateLeadStatusStatus = (
  leadStatusId: number,
  isActive: boolean
) => {
  return api.patch(`lead-statuses/${leadStatusId}/status`, {
    is_active: isActive,
  });
};
