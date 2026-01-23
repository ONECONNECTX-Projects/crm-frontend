import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface ProductCategory {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Get all ProductCategory
export async function getAllProductCategory(): Promise<
  ApiResponse<ProductCategory[]>
> {
  const response = await api.get("product-categories");
  return response as unknown as ApiResponse<ProductCategory[]>;
}

// Create ProductCategory
export async function createProductCategory(
  data: ProductCategory
): Promise<ApiResponse<ProductCategory>> {
  return api.post("product-categories", data) as Promise<
    ApiResponse<ProductCategory>
  >;
}

// Update ProductCategory
export async function updateProductCategory(
  id: number,
  data: ProductCategory
): Promise<ApiResponse<ProductCategory>> {
  return api.put(`product-categories/${id}`, data) as Promise<
    ApiResponse<ProductCategory>
  >;
}

// Delete ProductCategory
export async function deleteProductCategory(
  id: number
): Promise<ApiResponse<void>> {
  return api.delete(`product-categories/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveProductCategory(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("product-categories/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateProductCategoryStatus = (
  ProductCategoryId: number,
  isActive: boolean
) => {
  return api.patch(`product-categories/${ProductCategoryId}/status`, {
    is_active: isActive,
  });
};
