import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface OpportunityPayload {
  name: string;
  amount: string;
  owner_id: string;
  company_id: string;
  contact_id: string;
  opportunity_source_id: string;
  opportunity_stage_id: string;
  opportunity_type_id: string;
  next_step: string;
  competitors: string;
  description: string;
  start_date: Date;
  close_date: Date;
}

export interface Opportunity {
  id: number;
  name: string;
  amount: string;
  owner_id: number;
  company_id: number;
  contact_id: number;
  opportunity_source_id: number;
  opportunity_stage_id: number;
  opportunity_type_id: number;
  next_step: string;
  competitors: string;
  description: string;
  start_date: Date;
  close_date: Date;
  is_active: boolean;
  is_delete: boolean;
  created_at: Date;
  updated_at: Date;
  owner: Company;
  company: Company;
  contact: Contact;
  stage: Company;
  type: Company;
  source: Company;
}

export interface Company {
  id: number;
  name: string;
}

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
}

// Get all Opportunity
export async function getAllOpportunity(): Promise<ApiResponse<Opportunity[]>> {
  const response = await api.get("opportunities");
  return response as unknown as ApiResponse<Opportunity[]>;
}

// Create Opportunity
export async function createOpportunity(
  data: OpportunityPayload,
): Promise<ApiResponse<OpportunityPayload>> {
  return api.post("opportunities", data) as Promise<
    ApiResponse<OpportunityPayload>
  >;
}

// Update Opportunity
export async function updateOpportunity(
  id: number,
  data: OpportunityPayload,
): Promise<ApiResponse<OpportunityPayload>> {
  return api.put(`opportunities/${id}`, data) as Promise<
    ApiResponse<OpportunityPayload>
  >;
}

// Delete Opportunity
export async function deleteOpportunity(
  id: number,
): Promise<ApiResponse<void>> {
  return api.delete(`opportunities/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveOpportunity(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("opportunities/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateOpportunityStatus = (
  OpportunityId: number,
  isActive: boolean,
) => {
  return api.patch(`opportunities/${OpportunityId}/status`, {
    is_active: isActive,
  });
};
