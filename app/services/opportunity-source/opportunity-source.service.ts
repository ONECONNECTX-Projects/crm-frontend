import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface OpportunitySource {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all OpportunitySources
export async function getAllOpportunitySources(): Promise<
  ApiResponse<OpportunitySource[]>
> {
  const response = await api.get("opportunities-sources");
  return response as unknown as ApiResponse<OpportunitySource[]>;
}

// Create OpportunitySource
export async function createOpportunitySource(
  data: OpportunitySource
): Promise<ApiResponse<OpportunitySource>> {
  return api.post("opportunities-sources", data) as Promise<
    ApiResponse<OpportunitySource>
  >;
}

// Update OpportunitySource
export async function updateOpportunitySource(
  id: number,
  data: OpportunitySource
): Promise<ApiResponse<OpportunitySource>> {
  return api.put(`opportunities-sources/${id}`, data) as Promise<
    ApiResponse<OpportunitySource>
  >;
}

// Delete OpportunitySource
export async function deleteOpportunitySource(
  id: number
): Promise<ApiResponse<void>> {
  return api.delete(`opportunities-sources/${id}`) as Promise<
    ApiResponse<void>
  >;
}

export async function getAllActiveOpportunitySources(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("opportunities-sources/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateOpportunitySourceStatus = (
  OpportunitySourceId: number,
  isActive: boolean
) => {
  return api.patch(`opportunities-sources/${OpportunitySourceId}/status`, {
    is_active: isActive,
  });
};
