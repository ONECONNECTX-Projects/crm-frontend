import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Designation {
  id: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DesignationsResponse {
  isSuccess: boolean;
  responseCode: number;
  AllDesignations: Designation[];
}

export interface CreateDesignationDto {
  name: string;
}

export interface UpdateDesignationDto {
  name?: string;
}

// Get all Designations
export async function getAllDesignations(): Promise<DesignationsResponse> {
  const response = await api.get("Designations");
  return response as unknown as DesignationsResponse;
}

// Get Designation by ID
export async function getDesignationById(
  id: number
): Promise<{ Designation: Designation }> {
  const response = await api.get(`Designations/${id}`);
  return response as unknown as { Designation: Designation };
}

// Create Designation
export async function createDesignation(
  data: CreateDesignationDto
): Promise<ApiResponse<Designation>> {
  return api.post("Designations", data) as Promise<ApiResponse<Designation>>;
}

// Update Designation
export async function updateDesignation(
  id: number,
  data: UpdateDesignationDto
): Promise<ApiResponse<Designation>> {
  return api.put(`Designations/${id}`, data) as Promise<
    ApiResponse<Designation>
  >;
}

// Delete Designation
export async function deleteDesignation(
  id: number
): Promise<ApiResponse<void>> {
  return api.delete(`Designations/${id}`) as Promise<ApiResponse<void>>;
}
