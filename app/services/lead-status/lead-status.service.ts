import { api, ApiResponse } from "@/app/utils/apiClient";

export interface LeadStatus {
  id: number;
  name: string;
  color?: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadStatusResponse {
  isSuccess: boolean;
  responseCode: number;
  AllStatus: LeadStatus[];
}

export interface CreateLeadStatusDto {
  name: string;
  color?: string;
}

export interface UpdateLeadStatusDto {
  name?: string;
  color?: string;
}

// Get all LeadStatus
export async function getAllLeadStatus(): Promise<LeadStatusResponse> {
  const response = await api.get("lead-statuses");
  return response as unknown as LeadStatusResponse;
}

// Create LeadStatus
export async function createLeadStatus(
  data: CreateLeadStatusDto
): Promise<ApiResponse<LeadStatus>> {
  return api.post("lead-statuses", data) as Promise<ApiResponse<LeadStatus>>;
}

// Update LeadStatus
export async function updateLeadStatus(
  id: number,
  data: UpdateLeadStatusDto
): Promise<ApiResponse<LeadStatus>> {
  return api.put(`lead-statuses/${id}`, data) as Promise<
    ApiResponse<LeadStatus>
  >;
}

// Delete LeadStatus
export async function deleteLeadStatus(id: number): Promise<ApiResponse<void>> {
  return api.delete(`lead-statuses/${id}`) as Promise<ApiResponse<void>>;
}
