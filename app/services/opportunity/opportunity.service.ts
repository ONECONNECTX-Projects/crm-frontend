import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";
import { Task } from "../task/task.service";
import { Notes } from "../notes/notes.service";
import { Attachment } from "../attachment/attachement.service";
import { Quote } from "../quote/quote.service";

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

// Get Opportunity by ID
export async function getOpportunityById(
  id: number,
): Promise<ApiResponse<Opportunity>> {
  const response = await api.get(`opportunities/${id}`);
  return response as unknown as ApiResponse<Opportunity>;
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

//Get Pages By Id

//Task
export async function getTaskByOpportunityId(
  id: number,
): Promise<ApiResponse<Task[]>> {
  const response = await api.get(`opportunities/getTaskByOpportunityId/${id}`);
  return response as unknown as ApiResponse<Task[]>;
}

//Notes
export async function getNoteByOpportunityId(
  id: number,
): Promise<ApiResponse<Notes[]>> {
  const response = await api.get(`opportunities/getNoteByOpportunityId/${id}`);
  return response as unknown as ApiResponse<Notes[]>;
}

//Quote
export async function getQuoteByOpportunityId(
  id: number,
): Promise<ApiResponse<Quote[]>> {
  const response = await api.get(`opportunities/getQuoteByOpportunityId/${id}`);
  return response as unknown as ApiResponse<Quote[]>;
}

//Attachment
export async function getAttachmentByOpportunityId(
  id: number,
): Promise<ApiResponse<Attachment[]>> {
  const response = await api.get(
    `opportunities/getAttachmentByOpportunityId/${id}`,
  );
  return response as unknown as ApiResponse<Attachment[]>;
}
