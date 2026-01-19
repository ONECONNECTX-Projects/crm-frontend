import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface LeadSource {
  id?: number;
  name: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Get all LeadSources
export async function getAllLeadSources(): Promise<ApiResponse<LeadSource[]>> {
  const response = await api.get("lead-sources");
  return response as unknown as ApiResponse<LeadSource[]>;
}

// Create LeadSource
export async function createLeadSource(
  data: LeadSource
): Promise<ApiResponse<LeadSource>> {
  return api.post("lead-sources", data) as Promise<ApiResponse<LeadSource>>;
}

// Update LeadSource
export async function updateLeadSource(
  id: number,
  data: LeadSource
): Promise<ApiResponse<LeadSource>> {
  return api.put(`lead-sources/${id}`, data) as Promise<
    ApiResponse<LeadSource>
  >;
}

// Delete LeadSource
export async function deleteLeadSource(id: number): Promise<ApiResponse<void>> {
  return api.delete(`lead-sources/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveLeadSources(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("lead-sources/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateLeadSourceStatus = (
  leadSourceId: number,
  isActive: boolean
) => {
  return api.patch(`lead-sources/${leadSourceId}/status`, {
    is_active: isActive,
  });
};
