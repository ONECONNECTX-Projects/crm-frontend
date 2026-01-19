import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role_id: number;
  is_system_admin: boolean;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Get all Users
export async function getAllUsers(): Promise<ApiResponse<User[]>> {
  const response = await api.get("users");
  return response as unknown as ApiResponse<User[]>;
}

// Get all active users for dropdown
export async function getAllActiveUsers(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("users/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}