import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface ProjectTeamPayload {
  project_id: number;
  name: string;
  member_ids: number[];
}

export interface ProjectTeam {
  id: number;
  name: string;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
  project_id: number;
  project: OptionDropDownModel;
  members: OptionDropDownModel[];
}

// Get all ProjectTeams
export async function getAllProjectTeam(): Promise<ApiResponse<ProjectTeam[]>> {
  const response = await api.get("project-teams");
  return response as unknown as ApiResponse<ProjectTeam[]>;
}

// Create ProjectTeam
export async function createProjectTeam(
  data: ProjectTeamPayload,
): Promise<ApiResponse<ProjectTeamPayload>> {
  return api.post("project-teams", data) as Promise<
    ApiResponse<ProjectTeamPayload>
  >;
}

// Delete ProjectTeam
export async function deleteProjectTeam(
  id: number,
): Promise<ApiResponse<void>> {
  return api.delete(`project-teams/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveProjectTeams(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("project-teams/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateProjectTeamStatus = (
  ProjectTeamId: number,
  isActive: boolean,
) => {
  return api.patch(`project-teams/${ProjectTeamId}/status`, {
    is_active: isActive,
  });
};

export async function getProjectTeamById(
  id: number,
): Promise<ApiResponse<ProjectTeam>> {
  const response = await api.get(`project-teams/${id}`);
  return response as unknown as ApiResponse<ProjectTeam>;
}
