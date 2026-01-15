import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Industry {
  id: number;
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

export interface CreateIndustryDto {
  name: string;
}

export interface UpdateIndustryDto {
  name?: string;
}

// Get all Industry
export async function getAllIndustry(): Promise<IndustryResponse> {
  const response = await api.get("industries");
  return response as unknown as IndustryResponse;
}

// Create Industry
export async function createIndustry(
  data: CreateIndustryDto
): Promise<ApiResponse<Industry>> {
  return api.post("industries", data) as Promise<ApiResponse<Industry>>;
}

// Update Industry
export async function updateIndustry(
  id: number,
  data: UpdateIndustryDto
): Promise<ApiResponse<Industry>> {
  return api.put(`industries/${id}`, data) as Promise<ApiResponse<Industry>>;
}

// Delete Industry
export async function deleteIndustry(id: number): Promise<ApiResponse<void>> {
  return api.delete(`industries/${id}`) as Promise<ApiResponse<void>>;
}
