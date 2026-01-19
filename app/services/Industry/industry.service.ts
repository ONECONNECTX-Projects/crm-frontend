import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Industry {
  id?: number;
  name: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IndustryResponse {
  isSuccess: boolean;
  responseCode: number;
  AllIndustries: Industry[];
}

// Get all Industry
export async function getAllIndustry(): Promise<IndustryResponse> {
  const response = await api.get("industries");
  return response as unknown as IndustryResponse;
}

// Create Industry
export async function createIndustry(
  data: Industry
): Promise<ApiResponse<Industry>> {
  return api.post("industries", data) as Promise<ApiResponse<Industry>>;
}

// Update Industry
export async function updateIndustry(
  id: number,
  data: Industry
): Promise<ApiResponse<Industry>> {
  return api.put(`industries/${id}`, data) as Promise<ApiResponse<Industry>>;
}

// Delete Industry
export async function deleteIndustry(id: number): Promise<ApiResponse<void>> {
  return api.delete(`industries/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveIndustry(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("industries/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateIndustryStatus = (industryId: number, isActive: boolean) => {
  return api.patch(`industries/${industryId}/status`, {
    is_active: isActive,
  });
};
