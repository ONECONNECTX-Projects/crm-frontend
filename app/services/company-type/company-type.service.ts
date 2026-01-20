import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface CompanyType {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all CompanyTypes
export async function getAllCompanyTypes(): Promise<
  ApiResponse<CompanyType[]>
> {
  const response = await api.get("company-types");
  return response as unknown as ApiResponse<CompanyType[]>;
}

// Create CompanyType
export async function createCompanyType(
  data: CompanyType
): Promise<ApiResponse<CompanyType>> {
  return api.post("company-types", data) as Promise<ApiResponse<CompanyType>>;
}

// Update CompanyType
export async function updateCompanyType(
  id: number,
  data: CompanyType
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

export async function getAllActiveCompanyType(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("company-types/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateCompanyTypeStatus = (
  CompanyTypeId: number,
  isActive: boolean
) => {
  return api.patch(`company-types/${CompanyTypeId}/status`, {
    is_active: isActive,
  });
};
