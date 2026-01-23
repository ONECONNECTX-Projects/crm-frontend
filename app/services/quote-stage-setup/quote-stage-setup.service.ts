import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface QuoteStage {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all QuoteStages
export async function getAllQuoteStages(): Promise<ApiResponse<QuoteStage[]>> {
  const response = await api.get("quote-stages");
  return response as unknown as ApiResponse<QuoteStage[]>;
}

// Create QuoteStage
export async function createQuoteStage(
  data: QuoteStage
): Promise<ApiResponse<QuoteStage>> {
  return api.post("quote-stages", data) as Promise<ApiResponse<QuoteStage>>;
}

// Update QuoteStage
export async function updateQuoteStage(
  id: number,
  data: QuoteStage
): Promise<ApiResponse<QuoteStage>> {
  return api.put(`quote-stages/${id}`, data) as Promise<
    ApiResponse<QuoteStage>
  >;
}

// Delete QuoteStage
export async function deleteQuoteStage(id: number): Promise<ApiResponse<void>> {
  return api.delete(`quote-stages/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveQuoteStages(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("quote-stages/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateQuoteStageStatus = (
  QuoteStageId: number,
  isActive: boolean
) => {
  return api.patch(`quote-stages/${QuoteStageId}/status`, {
    is_active: isActive,
  });
};
