import { api, ApiResponse } from "@/app/utils/apiClient";

export interface TaskType {
  id?: number;
  name: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskTypesResponse {
  isSuccess: boolean;
  responseCode: number;
  AllType: TaskType[];
}

// Get all TaskTypes
export async function getAllTaskTypes(): Promise<TaskTypesResponse> {
  const response = await api.get("task-types");
  return response as unknown as TaskTypesResponse;
}

// Create TaskType
export async function createTaskType(
  data: TaskType
): Promise<ApiResponse<TaskType>> {
  return api.post("task-types", data) as Promise<ApiResponse<TaskType>>;
}

// Update TaskType
export async function updateTaskType(
  id: number,
  data: TaskType
): Promise<ApiResponse<TaskType>> {
  return api.put(`task-types/${id}`, data) as Promise<ApiResponse<TaskType>>;
}

// Delete TaskType
export async function deleteTaskType(id: number): Promise<ApiResponse<void>> {
  return api.delete(`task-types/${id}`) as Promise<ApiResponse<void>>;
}

export const updateTaskTypeStatus = (roleId: number, isActive: boolean) => {
  return api.patch(`task-types/${roleId}/status`, {
    is_active: isActive,
  });
};
