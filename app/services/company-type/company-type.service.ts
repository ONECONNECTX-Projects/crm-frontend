import { api, ApiResponse } from "@/app/utils/apiClient";

export interface CompanyType {
  id: number;
  name: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyTypesResponse {
  isSuccess: boolean;
  responseCode: number;
  AllCompanyTypes: CompanyType[];
}

export interface CreateCompanyTypeDto {
  name: string;
}

export interface UpdateCompanyTypeDto {
  name?: string;
}

// Get all CompanyTypes
export async function getAllCompanyTypes(): Promise<CompanyTypesResponse> {
  const response = await api.get("company-types");
  return response as unknown as CompanyTypesResponse;
}

// Create CompanyType
export async function createCompanyType(
  data: CreateCompanyTypeDto
): Promise<ApiResponse<CompanyType>> {
  return api.post("company-types", data) as Promise<ApiResponse<CompanyType>>;
}

// Update CompanyType
export async function updateCompanyType(
  id: number,
  data: UpdateCompanyTypeDto
): Promise<ApiResponse<CompanyType>> {
  return api.put(`company-types/${id}`, data) as Promise<
    ApiResponse<CompanyType>
  >;
}

// Delete CompanyType
export async function deleteCompanyType(
  id: number
): Promise<ApiResponse<void>> {
  return api.delete(`company-types/${id}`) as Promise<ApiResponse<void>>;
}
