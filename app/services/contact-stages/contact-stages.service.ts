import { api, ApiResponse } from "@/app/utils/apiClient";

export interface ContactStage {
  id: number;
  name: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactStagesResponse {
  isSuccess: boolean;
  responseCode: number;
  AllStages: ContactStage[];
}

export interface CreateContactStageDto {
  name: string;
}

export interface UpdateContactStageDto {
  name?: string;
}

// Get all ContactStages
export async function getAllContactStages(): Promise<ContactStagesResponse> {
  const response = await api.get("contact-stages");
  return response as unknown as ContactStagesResponse;
}

// Create ContactStage
export async function createContactStage(
  data: CreateContactStageDto
): Promise<ApiResponse<ContactStage>> {
  return api.post("contact-stages", data) as Promise<ApiResponse<ContactStage>>;
}

// Update ContactStage
export async function updateContactStage(
  id: number,
  data: UpdateContactStageDto
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
