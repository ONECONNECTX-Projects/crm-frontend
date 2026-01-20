import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface ContactSource {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all ContactSources
export async function getAllContactSources(): Promise<
  ApiResponse<ContactSource[]>
> {
  const response = await api.get("contact-sources");
  return response as unknown as ApiResponse<ContactSource[]>;
}

// Create ContactSource
export async function createContactSource(
  data: ContactSource
): Promise<ApiResponse<ContactSource>> {
  return api.post("contact-sources", data) as Promise<
    ApiResponse<ContactSource>
  >;
}

// Update ContactSource
export async function updateContactSource(
  id: number,
  data: ContactSource
): Promise<ApiResponse<ContactSource>> {
  return api.put(`contact-sources/${id}`, data) as Promise<
    ApiResponse<ContactSource>
  >;
}

// Delete ContactSource
export async function deleteContactSource(
  id: number
): Promise<ApiResponse<void>> {
  return api.delete(`contact-sources/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveContactSource(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("contact-sources/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateContactSourceStatus = (
  contactSourceId: number,
  isActive: boolean
) => {
  return api.patch(`contact-sources/${contactSourceId}/status`, {
    is_active: isActive,
  });
};
