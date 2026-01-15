import { api } from "@/app/utils/apiClient";

export interface Profile {
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

export interface ProfilesResponse {
  isSuccess: boolean;
  responseCode: number;
  user: Profile;
}

// Get all Profiles
export async function getAllProfiles(): Promise<ProfilesResponse> {
  const response = await api.get("auth/profile");
  return response as unknown as ProfilesResponse;
}
