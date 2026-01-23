import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface TicketCategory {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all TicketCategory
export async function getAllTicketCategory(): Promise<
  ApiResponse<TicketCategory[]>
> {
  const response = await api.get("ticket-categories");
  return response as unknown as ApiResponse<TicketCategory[]>;
}

// Create TicketCategory
export async function createTicketCategory(
  data: TicketCategory
): Promise<ApiResponse<TicketCategory>> {
  return api.post("ticket-categories", data) as Promise<
    ApiResponse<TicketCategory>
  >;
}

// Update TicketCategory
export async function updateTicketCategory(
  id: number,
  data: TicketCategory
): Promise<ApiResponse<TicketCategory>> {
  return api.put(`ticket-categories/${id}`, data) as Promise<
    ApiResponse<TicketCategory>
  >;
}

// Delete TicketCategory
export async function deleteTicketCategory(
  id: number
): Promise<ApiResponse<void>> {
  return api.delete(`ticket-categories/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveTicketCategory(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("ticket-categories/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateTicketCategoryStatus = (
  TicketCategoryId: number,
  isActive: boolean
) => {
  return api.patch(`ticket-categories/${TicketCategoryId}/status`, {
    is_active: isActive,
  });
};
