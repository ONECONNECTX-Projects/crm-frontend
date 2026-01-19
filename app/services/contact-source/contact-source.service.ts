import { api, ApiResponse } from "@/app/utils/apiClient";

export interface ContactSource {
  id?: number;
  name: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactSourcesResponse {
  isSuccess: boolean;
  responseCode: number;
  AllSources: ContactSource[];
}

// Get all ContactSources
export async function getAllContactSources(): Promise<ContactSourcesResponse> {
  const response = await api.get("contact-sources");
  return response as unknown as ContactSourcesResponse;
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
