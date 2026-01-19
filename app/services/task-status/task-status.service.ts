import { api, ApiResponse } from "@/app/utils/apiClient";

export interface TaskStatus {
  id?: number;
  name: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskStatusResponse {
  isSuccess: boolean;
  responseCode: number;
  AllStatus: TaskStatus[];
}

// Get all TaskStatus
export async function getAllTaskStatus(): Promise<TaskStatusResponse> {
  const response = await api.get("task-statuses");
  return response as unknown as TaskStatusResponse;
}

// Create TaskStatus
export async function createTaskStatus(
  data: TaskStatus
): Promise<ApiResponse<TaskStatus>> {
  return api.post("task-statuses", data) as Promise<ApiResponse<TaskStatus>>;
}

// Update TaskStatus
export async function updateTaskStatus(
  id: number,
  data: TaskStatus
): Promise<ApiResponse<TaskStatus>> {
  return api.put(`task-statuses/${id}`, data) as Promise<
    ApiResponse<TaskStatus>
  >;
}

// Delete TaskStatus
export async function deleteTaskStatus(id: number): Promise<ApiResponse<void>> {
  return api.delete(`task-statuses/${id}`) as Promise<ApiResponse<void>>;
}

export const updateTaskStatusStatus = (roleId: number, isActive: boolean) => {
  return api.patch(`task-statuses/${roleId}/status`, {
    is_active: isActive,
  });
};
