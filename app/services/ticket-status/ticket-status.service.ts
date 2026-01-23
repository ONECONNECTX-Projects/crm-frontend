import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface TicketStatus {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all TicketStatus
export async function getAllTicketStatus(): Promise<
  ApiResponse<TicketStatus[]>
> {
  const response = await api.get("ticket-statuses");
  return response as unknown as ApiResponse<TicketStatus[]>;
}

// Create TicketStatus
export async function createTicketStatus(
  data: TicketStatus
): Promise<ApiResponse<TicketStatus>> {
  return api.post("ticket-statuses", data) as Promise<
    ApiResponse<TicketStatus>
  >;
}

// Update TicketStatus
export async function updateTicketStatus(
  id: number,
  data: TicketStatus
): Promise<ApiResponse<TicketStatus>> {
  return api.put(`ticket-statuses/${id}`, data) as Promise<
    ApiResponse<TicketStatus>
  >;
}

// Delete TicketStatus
export async function deleteTicketStatus(
  id: number
): Promise<ApiResponse<void>> {
  return api.delete(`ticket-statuses/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveTicketStatus(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("ticket-statuses/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateTicketStatusStatus = (
  TicketStatusId: number,
  isActive: boolean
) => {
  return api.patch(`ticket-statuses/${TicketStatusId}/status`, {
    is_active: isActive,
  });
};
