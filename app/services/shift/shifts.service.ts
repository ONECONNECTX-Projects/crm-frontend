import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Shift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ShiftsResponse {
  isSuccess: boolean;
  responseCode: number;
  AllShifts: Shift[];
}

export interface CreateShiftDto {
  name: string;
  start_time: string;
  end_time: string;
}

export interface UpdateShiftDto {
  name?: string;
  start_time?: string;
  end_time?: string;
}

// Get all shifts
export async function getAllShifts(): Promise<ShiftsResponse> {
  const response = await api.get("shifts");
  return response as unknown as ShiftsResponse;
}

// Get shift by ID
export async function getShiftById(id: number): Promise<{ shift: Shift }> {
  const response = await api.get(`shifts/${id}`);
  return response as unknown as { shift: Shift };
}

// Create shift
export async function createShift(
  data: CreateShiftDto
): Promise<ApiResponse<Shift>> {
  return api.post("shifts", data) as Promise<ApiResponse<Shift>>;
}

// Update shift
export async function updateShift(
  id: number,
  data: UpdateShiftDto
): Promise<ApiResponse<Shift>> {
  return api.put(`shifts/${id}`, data) as Promise<ApiResponse<Shift>>;
}

// Delete shift
export async function deleteShift(id: number): Promise<ApiResponse<void>> {
  return api.delete(`shifts/${id}`) as Promise<ApiResponse<void>>;
}
