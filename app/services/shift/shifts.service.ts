import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Shift {
  id?: number;
  name: string;
  start_time: string;
  end_time: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all shifts
export async function getAllShifts(): Promise<ApiResponse<Shift[]>> {
  const response = await api.get("shifts");
  return response as unknown as ApiResponse<Shift[]>;
}

// Get shift by ID
export async function getShiftById(id: number): Promise<{ shift: Shift }> {
  const response = await api.get(`shifts/${id}`);
  return response as unknown as { shift: Shift };
}

// Create shift
export async function createShift(data: Shift): Promise<ApiResponse<Shift>> {
  return api.post("shifts", data) as Promise<ApiResponse<Shift>>;
}

// Update shift
export async function updateShift(
  id: number,
  data: Shift
): Promise<ApiResponse<Shift>> {
  return api.put(`shifts/${id}`, data) as Promise<ApiResponse<Shift>>;
}

// Delete shift
export async function deleteShift(id: number): Promise<ApiResponse<void>> {
  return api.delete(`shifts/${id}`) as Promise<ApiResponse<void>>;
}

export const updateShiftStatus = (roleId: number, isActive: boolean) => {
  return api.patch(`shifts/${roleId}/status`, {
    is_active: isActive,
  });
};

export async function getAllActiveShift(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("shifts/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}
