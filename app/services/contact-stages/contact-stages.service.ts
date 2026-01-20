import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface ContactStage {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all ContactStages
export async function getAllContactStages(): Promise<
  ApiResponse<ContactStage[]>
> {
  const response = await api.get("contact-stages");
  return response as unknown as ApiResponse<ContactStage[]>;
}

// Create ContactStage
export async function createContactStage(
  data: ContactStage
): Promise<ApiResponse<ContactStage>> {
  return api.post("contact-stages", data) as Promise<ApiResponse<ContactStage>>;
}

// Update ContactStage
export async function updateContactStage(
  id: number,
  data: ContactStage
): Promise<ApiResponse<ContactStage>> {
  return api.put(`contact-stages/${id}`, data) as Promise<
    ApiResponse<ContactStage>
  >;
}

// Delete ContactStage
export async function deleteContactStage(
  id: number
): Promise<ApiResponse<void>> {
  return api.delete(`contact-stages/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveContactStage(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("contact-stages/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateContactStageStatus = (
  ContactStageId: number,
  isActive: boolean
) => {
  return api.patch(`contact-stages/${ContactStageId}/status`, {
    is_active: isActive,
  });
};
