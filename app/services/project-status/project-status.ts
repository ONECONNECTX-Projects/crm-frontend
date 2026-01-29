import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface ProjectStatus {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all ProjectStatus
export async function getAllProjectStatus(): Promise<
  ApiResponse<ProjectStatus[]>
> {
  const response = await api.get("project-statuses");
  return response as unknown as ApiResponse<ProjectStatus[]>;
}

// Create ProjectStatus
export async function createProjectStatus(
  data: ProjectStatus,
): Promise<ApiResponse<ProjectStatus>> {
  return api.post("project-statuses", data) as Promise<
    ApiResponse<ProjectStatus>
  >;
}

// Update ProjectStatus
export async function updateProjectStatus(
  id: number,
  data: ProjectStatus,
): Promise<ApiResponse<ProjectStatus>> {
  return api.put(`project-statuses/${id}`, data) as Promise<
    ApiResponse<ProjectStatus>
  >;
}

// Delete ProjectStatus
export async function deleteProjectStatus(
  id: number,
): Promise<ApiResponse<void>> {
  return api.delete(`project-statuses/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveProjectStatus(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("project-statuses/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateProjectStatusStatus = (
  ProjectStatusId: number,
  isActive: boolean,
) => {
  return api.patch(`project-statuses/${ProjectStatusId}/status`, {
    is_active: isActive,
  });
};
