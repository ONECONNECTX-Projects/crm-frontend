import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Priority {
  id?: number;
  name: string;
  color?: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Get all Priority
export async function getAllPriority(): Promise<ApiResponse<Priority[]>> {
  const response = await api.get("priorities");
  return response as unknown as ApiResponse<Priority[]>;
}

// Create Priority
export async function createPriority(
  data: Priority
): Promise<ApiResponse<Priority>> {
  return api.post("priorities", data) as Promise<ApiResponse<Priority>>;
}

// Update Priority
export async function updatePriority(
  id: number,
  data: Priority
): Promise<ApiResponse<Priority>> {
  return api.put(`priorities/${id}`, data) as Promise<ApiResponse<Priority>>;
}

// Delete Priority
export async function deletePriority(id: number): Promise<ApiResponse<void>> {
  return api.delete(`priorities/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActivePriority(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("priorities/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updatePriorityStatus = (priorityId: number, isActive: boolean) => {
  return api.patch(`priorities/${priorityId}/status`, {
    is_active: isActive,
  });
};
