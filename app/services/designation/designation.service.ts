import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Designation {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all Designations
export async function getAllDesignations(): Promise<
  ApiResponse<Designation[]>
> {
  const response = await api.get("Designations");
  return response as unknown as ApiResponse<Designation[]>;
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
  data: Designation
): Promise<ApiResponse<Designation>> {
  return api.post("Designations", data) as Promise<ApiResponse<Designation>>;
}

// Update Designation
export async function updateDesignation(
  id: number,
  data: Designation
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

export async function getAllActiveDesignation(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("Designations/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateDesignationStatus = (
  designationId: number,
  isActive: boolean
) => {
  return api.patch(`Designations/${designationId}/status`, {
    is_active: isActive,
  });
};
