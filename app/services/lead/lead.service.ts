import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";
import { LeadStatus } from "../lead-status/lead-status.service";
import { Priority } from "../priority/priority.service";

export interface Lead {
  name: string;
  email: string;
  phone: string;
  lead_owner_id: number;
  lead_source_id: number;
  lead_status_id: number;
  priority_id: number;
  lead_value: string;
}

export interface Leads {
  id: number;
  name: string;
  email: string;
  phone: string;
  lead_owner_id: number;
  lead_source_id: number;
  lead_status_id: number;
  priority_id: number;
  lead_value: string;
  is_active: boolean;
  is_delete: boolean;
  created_at: Date;
  updated_at: Date;
  owner: OptionDropDownModel;
  source: OptionDropDownModel;
  contact: { id: number };
  status: LeadStatus;
  priority: Priority;
}

export interface ConvertLeadModel {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthday: Date;
  owner_id: number;
  company_id: number;
  job_title: string;
  department_id: number;
}

// Get all Leads
export async function getAllLead(): Promise<ApiResponse<Leads[]>> {
  const response = await api.get("leads");
  return response as unknown as ApiResponse<Leads[]>;
}

// Create Lead
export async function createLead(data: Lead): Promise<ApiResponse<Lead>> {
  return api.post("leads", data) as Promise<ApiResponse<Lead>>;
}

// Update Lead
export async function updateLead(
  id: number,
  data: Lead,
): Promise<ApiResponse<Lead>> {
  return api.put(`leads/${id}`, data) as Promise<ApiResponse<Lead>>;
}

// Delete Lead
export async function deleteLead(id: number): Promise<ApiResponse<void>> {
  return api.delete(`leads/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveLeads(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("leads/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateLeadStatus = (LeadId: number, isActive: boolean) => {
  return api.patch(`leads/${LeadId}/status`, {
    is_active: isActive,
  });
};

// Get leads by ID
export async function getLeadById(id: number): Promise<ApiResponse<Leads>> {
  const response = await api.get(`leads/${id}`);
  return response as unknown as ApiResponse<Leads>;
}

export async function convertLeadToContact(
  id: number,
  data: ConvertLeadModel,
): Promise<ApiResponse<Leads>> {
  const response = await api.post(`leads/${id}/convert`, data);
  return response as unknown as ApiResponse<Leads>;
}
