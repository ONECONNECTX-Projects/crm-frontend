import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface QuoteProduct {
  id: number;
  name: string;
  rate: string;
  unit: string;
  category_id: number;
  description: string;
  is_active: boolean;
  is_delete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: number;
  quantity: number;
  price: string;
  discount: string;
  total: string;
  createdAt: string;
  updatedAt: string;
  quote_id: number;
  product_id: number;
  product: QuoteProduct;
}

export interface QuoteOwner {
  id: number;
  name: string;
  email: string;
  mobile: string;
}

export interface QuoteCompany {
  id: number;
  name: string;
  company_size: number;
  annual_revenue: string;
  phone: string;
  email: string;
}

export interface QuoteContact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface QuoteStage {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Quote {
  id: number;
  name: string;
  total_amount: string;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner_id: number;
  company_id: number;
  contact_id: number;
  opportunity_id: number;
  quote_stage_id: number;
  owner: OptionDropDownModel;
  company: OptionDropDownModel;
  contact: OptionDropDownModel;
  stage: OptionDropDownModel;
  quote_date: Date;
  expiry_date: Date;
}

export interface QuoteDetail {
  id: number;
  name: string;
  total_amount: string;
  is_active: boolean;
  is_delete: boolean;
  quote_date: string;
  expiry_date: string | null;
  createdAt: string;
  updatedAt: string;
  owner_id: number;
  company_id: number;
  contact_id: number;
  opportunity_id: number;
  quote_stage_id: number;
  items: QuoteItem[];
  owner: QuoteOwner;
  company: QuoteCompany;
  contact: QuoteContact;
  stage: QuoteStage;
  description: string;
  terms: string;
}

export interface QuotePayload {
  name: string;
  quote_date: Date;
  expiration_date: Date;
  owner_id: number;
  company_id: number;
  contact_id: number;
  opportunity_id: number;
  quote_stage_id: number;
  terms: string;
  description: string;
  items: Item[];
}

export interface Item {
  product_id: number;
  quantity: number;
  price: number;
  discount: number;
}

export async function getAllQuote(): Promise<ApiResponse<Quote[]>> {
  const response = await api.get("quotes");
  return response as unknown as ApiResponse<Quote[]>;
}

// Create Quote
export async function createQuote(
  data: QuotePayload,
): Promise<ApiResponse<QuotePayload>> {
  return api.post("quotes", data) as Promise<ApiResponse<QuotePayload>>;
}

// Update Quote
export async function updateQuote(
  id: number,
  data: QuotePayload,
): Promise<ApiResponse<QuotePayload>> {
  return api.put(`quotes/${id}`, data) as Promise<ApiResponse<QuotePayload>>;
}

// Delete Quote
export async function deleteQuote(id: number): Promise<ApiResponse<void>> {
  return api.delete(`quotes/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveQuotes(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("quotes/active/list");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateQuoteStatus = (QuoteId: number, isActive: boolean) => {
  return api.patch(`quotes/${QuoteId}/status`, {
    is_active: isActive,
  });
};

// Get Quotes by ID
export async function getQuoteById(
  id: number,
): Promise<ApiResponse<QuoteDetail>> {
  const response = await api.get(`quotes/${id}`);
  return response as unknown as ApiResponse<QuoteDetail>;
}
