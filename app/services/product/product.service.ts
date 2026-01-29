import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface ProductPayload {
  name: string;
  rate: string;
  unit: string;
  category_id: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  rate: string;
  unit: string;
  category_id: string;
  description: string;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: OptionDropDownModel;
}

// Get all Products
export async function getAllProduct(): Promise<ApiResponse<Product[]>> {
  const response = await api.get("products");
  return response as unknown as ApiResponse<Product[]>;
}

// Create Product
export async function createProduct(
  data: ProductPayload,
): Promise<ApiResponse<ProductPayload>> {
  return api.post("products", data) as Promise<ApiResponse<ProductPayload>>;
}

// Update Product
export async function updateProduct(
  id: number,
  data: ProductPayload,
): Promise<ApiResponse<ProductPayload>> {
  return api.put(`products/${id}`, data) as Promise<
    ApiResponse<ProductPayload>
  >;
}

// Delete Product
export async function deleteProduct(id: number): Promise<ApiResponse<void>> {
  return api.delete(`products/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveProducts(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("products/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateProductStatus = (ProductId: number, isActive: boolean) => {
  return api.patch(`products/${ProductId}/status`, {
    is_active: isActive,
  });
};

export async function getProductById(
  id: number,
): Promise<ApiResponse<Product>> {
  const response = await api.get(`products/${id}`);
  return response as unknown as ApiResponse<Product>;
}
