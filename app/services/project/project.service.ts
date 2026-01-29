import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface ProjectPayload {
  name: string;
  manager_id: number;
  contact_id: number;
  project_status_id: number;
  priority_id: number;
  project_value: number;
  start_date: Date;
  deadline: Date;
  description: string;
}

export interface Project {
  id: number;
  name: string;
  manager_id: number;
  contact_id: number;
  project_status_id: number;
  priority_id: number;
  project_value: string;
  start_date: Date;
  deadline: Date;
  description: string;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
  manager: OptionDropDownModel;
  contact: OptionDropDownModel;
  status: OptionDropDownModel;
  priority: OptionDropDownModel;
}

// Get all Projects
export async function getAllProject(): Promise<ApiResponse<Project[]>> {
  const response = await api.get("projects");
  return response as unknown as ApiResponse<Project[]>;
}

// Create Project
export async function createProject(
  data: ProjectPayload,
): Promise<ApiResponse<ProjectPayload>> {
  return api.post("projects", data) as Promise<ApiResponse<ProjectPayload>>;
}

// Update Project
export async function updateProject(
  id: number,
  data: ProjectPayload,
): Promise<ApiResponse<ProjectPayload>> {
  return api.put(`projects/${id}`, data) as Promise<
    ApiResponse<ProjectPayload>
  >;
}

// Delete Project
export async function deleteProject(id: number): Promise<ApiResponse<void>> {
  return api.delete(`projects/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveProjects(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("projects/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateProjectStatus = (ProjectId: number, isActive: boolean) => {
  return api.patch(`projects/${ProjectId}/status`, {
    is_active: isActive,
  });
};

export async function getProjectById(
  id: number,
): Promise<ApiResponse<Project>> {
  const response = await api.get(`projects/${id}`);
  return response as unknown as ApiResponse<Project>;
}
