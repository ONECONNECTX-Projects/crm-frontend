import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Role {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  createdAt?: string;
  updatedAt?: string;
  permissionsCount?: number;
  usersCount?: number;
}

export interface UpdateRolePermissionsDto {
  role_id: number;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  module_id: number;
  module_name: string;
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
  assigned: boolean;
}
// Get all roles
export async function getAllRoles(): Promise<ApiResponse<Role[]>> {
  const response = await api.get("roles");
  return response as unknown as ApiResponse<Role[]>;
}

// Get role by ID
export async function getAllActiveRoles(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("roles/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

// Create role
export async function createRole(data: Role): Promise<ApiResponse<Role>> {
  return api.post("roles", data) as Promise<ApiResponse<Role>>;
}

// Update role
export async function updateRole(
  id: number,
  data: Role
): Promise<ApiResponse<Role>> {
  return api.put(`roles/${id}`, data) as Promise<ApiResponse<Role>>;
}

// Delete role
export async function deleteRole(id: number): Promise<ApiResponse<void>> {
  return api.delete(`roles/${id}`) as Promise<ApiResponse<void>>;
}

export const updateRoleStatus = (roleId: number, isActive: boolean) => {
  return api.patch(`roles/${roleId}/status`, {
    is_active: isActive,
  });
};

export async function getPermissionsByRoleId(
  roleId: number
): Promise<ApiResponse<Permission[]>> {
  const response = await api.get(`role-permissions/${roleId}`);
  return response as unknown as ApiResponse<Permission[]>;
}

export async function assignPermissionsToRole(
  updateRolePermissionsDto: UpdateRolePermissionsDto
): Promise<ApiResponse<void>> {
  return api.post(
    `role-permissions/assign`,
    updateRolePermissionsDto
  ) as Promise<ApiResponse<void>>;
}
