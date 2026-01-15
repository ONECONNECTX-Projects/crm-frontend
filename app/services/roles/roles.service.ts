import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Role {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  permissionsCount?: number;
  usersCount?: number;
}

export interface RolesResponse {
  isSuccess: boolean;
  responseCode: number;
  roles: Role[];
}

export interface CreateRoleDto {
  name: string;
  description: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

// Get all roles
export async function getAllRoles(): Promise<RolesResponse> {
  const response = await api.get("roles");
  return response as unknown as RolesResponse;
}

// Get role by ID
export async function getRoleById(id: number): Promise<{ role: Role }> {
  const response = await api.get(`roles/${id}`);
  return response as unknown as { role: Role };
}

// Create role
export async function createRole(
  data: CreateRoleDto
): Promise<ApiResponse<Role>> {
  return api.post("roles", data) as Promise<ApiResponse<Role>>;
}

// Update role
export async function updateRole(
  id: number,
  data: UpdateRoleDto
): Promise<ApiResponse<Role>> {
  return api.put(`roles/${id}`, data) as Promise<ApiResponse<Role>>;
}

// Delete role
export async function deleteRole(id: number): Promise<ApiResponse<void>> {
  return api.delete(`roles/${id}`) as Promise<ApiResponse<void>>;
}