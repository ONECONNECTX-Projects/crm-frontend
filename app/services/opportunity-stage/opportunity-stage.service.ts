import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface OpportunityStage {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all OpportunityStages
export async function getAllOpportunityStages(): Promise<
  ApiResponse<OpportunityStage[]>
> {
  const response = await api.get("opportunities-stages");
  return response as unknown as ApiResponse<OpportunityStage[]>;
}

// Create OpportunityStage
export async function createOpportunityStage(
  data: OpportunityStage
): Promise<ApiResponse<OpportunityStage>> {
  return api.post("opportunities-stages", data) as Promise<
    ApiResponse<OpportunityStage>
  >;
}

// Update OpportunityStage
export async function updateOpportunityStage(
  id: number,
  data: OpportunityStage
): Promise<ApiResponse<OpportunityStage>> {
  return api.put(`opportunities-stages/${id}`, data) as Promise<
    ApiResponse<OpportunityStage>
  >;
}

// Delete OpportunityStage
export async function deleteOpportunityStage(
  id: number
): Promise<ApiResponse<void>> {
  return api.delete(`opportunities-stages/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveOpportunityStages(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("opportunities-stages/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateOpportunityStageStatus = (
  OpportunityStageId: number,
  isActive: boolean
) => {
  return api.patch(`opportunities-stages/${OpportunityStageId}/status`, {
    is_active: isActive,
  });
};
