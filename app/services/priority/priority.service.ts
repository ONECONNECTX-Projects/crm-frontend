import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Priority {
  id: number;
  name: string;
  color?: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriorityResponse {
  isSuccess: boolean;
  responseCode: number;
  AllPriorities: Priority[];
}

export interface CreatePriorityDto {
  name: string;
  color?: string;
}

export interface UpdatePriorityDto {
  name?: string;
  color?: string;
}

// Get all Priority
export async function getAllPriority(): Promise<PriorityResponse> {
  const response = await api.get("priorities");
  return response as unknown as PriorityResponse;
}

// Create Priority
export async function createPriority(
  data: CreatePriorityDto
): Promise<ApiResponse<Priority>> {
  return api.post("priorities", data) as Promise<ApiResponse<Priority>>;
}

// Update Priority
export async function updatePriority(
  id: number,
  data: UpdatePriorityDto
): Promise<ApiResponse<Priority>> {
  return api.put(`priorities/${id}`, data) as Promise<ApiResponse<Priority>>;
}

// Delete Priority
export async function deletePriority(id: number): Promise<ApiResponse<void>> {
  return api.delete(`priorities/${id}`) as Promise<ApiResponse<void>>;
}
