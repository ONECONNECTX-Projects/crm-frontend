import { api, ApiResponse } from "@/app/utils/apiClient";

export interface LeadSource {
  id: number;
  name: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadSourcesResponse {
  isSuccess: boolean;
  responseCode: number;
  AllLeadSources: LeadSource[];
}

export interface CreateLeadSourceDto {
  name: string;
}

export interface UpdateLeadSourceDto {
  name?: string;
}

// Get all LeadSources
export async function getAllLeadSources(): Promise<LeadSourcesResponse> {
  const response = await api.get("lead-sources");
  return response as unknown as LeadSourcesResponse;
}

// Create LeadSource
export async function createLeadSource(
  data: CreateLeadSourceDto
): Promise<ApiResponse<LeadSource>> {
  return api.post("lead-sources", data) as Promise<ApiResponse<LeadSource>>;
}

// Update LeadSource
export async function updateLeadSource(
  id: number,
  data: UpdateLeadSourceDto
): Promise<ApiResponse<LeadSource>> {
  return api.put(`lead-sources/${id}`, data) as Promise<
    ApiResponse<LeadSource>
  >;
}

// Delete LeadSource
export async function deleteLeadSource(id: number): Promise<ApiResponse<void>> {
  return api.delete(`lead-sources/${id}`) as Promise<ApiResponse<void>>;
}
