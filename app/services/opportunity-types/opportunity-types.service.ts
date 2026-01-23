import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface OpportunityType {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all OpportunityTypes
export async function getAllOpportunityTypes(): Promise<
  ApiResponse<OpportunityType[]>
> {
  const response = await api.get("opportunities-types");
  return response as unknown as ApiResponse<OpportunityType[]>;
}

// Create OpportunityType
export async function createOpportunityType(
  data: OpportunityType
): Promise<ApiResponse<OpportunityType>> {
  return api.post("opportunities-types", data) as Promise<
    ApiResponse<OpportunityType>
  >;
}

// Update OpportunityType
export async function updateOpportunityType(
  id: number,
  data: OpportunityType
): Promise<ApiResponse<OpportunityType>> {
  return api.put(`opportunities-types/${id}`, data) as Promise<
    ApiResponse<OpportunityType>
  >;
}

// Delete OpportunityType
export async function deleteOpportunityType(
  id: number
): Promise<ApiResponse<void>> {
  return api.delete(`opportunities-types/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveOpportunityTypes(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("opportunities-types/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateOpportunityTypeStatus = (
  OpportunityTypeId: number,
  isActive: boolean
) => {
  return api.patch(`opportunities-types/${OpportunityTypeId}/status`, {
    is_active: isActive,
  });
};
