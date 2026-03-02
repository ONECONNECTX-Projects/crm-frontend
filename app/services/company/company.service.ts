import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";
import { Opportunity } from "../opportunity/opportunity.service";
import { Task } from "../task/task.service";
import { Notes } from "../notes/notes.service";
import { Attachment } from "../attachment/attachement.service";
import { Quote } from "../quote/quote.service";
import { Contact } from "../contact/contact.service";
import { Project } from "../project/project.service";
// Company info for create/update
export interface CompanyInfo {
  name: string;
  owner_id: string;
  industry_id: string;
  company_type_id: string;
  company_size: string;
  annual_revenue: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
}

// Address info for create/update
export interface CompanyAddress {
  billing_street: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_country: string;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
}

export interface CompanyPayload {
  company: CompanyInfo;
  address: CompanyAddress;
}

export interface Company {
  id: number;
  name: string;
  company_size: string;
  annual_revenue: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner_id: string;
  industry_id: string;
  company_type_id: string;
  industry: CompanyType;
  company_type: CompanyType;
  owner: OptionDropDownModel;
  address: CompanyAddress;
}

export interface CompanyType {
  id: number;
  name: string;
  is_active: boolean;
  is_delete: boolean;
  created_at: Date;
  updated_at: Date;
}

// Get all Company
export async function getAllCompany(): Promise<ApiResponse<Company[]>> {
  const response = await api.get("companies");
  return response as unknown as ApiResponse<Company[]>;
}

// Get Company by ID
export async function getCompanyById(
  id: number,
): Promise<ApiResponse<Company>> {
  const response = await api.get(`companies/${id}`);
  return response as unknown as ApiResponse<Company>;
}

// Create Company
export async function createCompany(
  data: CompanyPayload,
): Promise<ApiResponse<Company>> {
  return api.post("companies", data) as Promise<ApiResponse<Company>>;
}

// Update Company
export async function updateCompany(
  id: number,
  data: CompanyPayload,
): Promise<ApiResponse<Company>> {
  return api.put(`companies/${id}`, data) as Promise<ApiResponse<Company>>;
}

// Delete Company
export async function deleteCompany(id: number): Promise<ApiResponse<void>> {
  return api.delete(`companies/${id}`) as Promise<ApiResponse<void>>;
}

// Get all active Company for dropdown
export async function getAllActiveCompany(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("companies/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

// Update Company status
export const updateCompanyStatus = (CompanyId: number, isActive: boolean) => {
  return api.patch(`companies/${CompanyId}/status`, {
    is_active: isActive,
  });
};

//Get Pages By Id

//Opportunity
export async function getOpportunityByCompanyId(
  id: number,
): Promise<ApiResponse<Opportunity[]>> {
  const response = await api.get(`companies/getOpportunityByCompanyId/${id}`);
  return response as unknown as ApiResponse<Opportunity[]>;
}

//Task
export async function getTaskByCompanyId(
  id: number,
): Promise<ApiResponse<Task[]>> {
  const response = await api.get(`companies/getTaskByCompanyId/${id}`);
  return response as unknown as ApiResponse<Task[]>;
}

//Notes
export async function getNoteByCompanyId(
  id: number,
): Promise<ApiResponse<Notes[]>> {
  const response = await api.get(`companies/getNoteByCompanyId/${id}`);
  return response as unknown as ApiResponse<Notes[]>;
}

//Quote
export async function getQuoteByCompanyId(
  id: number,
): Promise<ApiResponse<Quote[]>> {
  const response = await api.get(`companies/getQuoteByCompanyId/${id}`);
  return response as unknown as ApiResponse<Quote[]>;
}

//Attachment
export async function getAttachmentByCompanyId(
  id: number,
): Promise<ApiResponse<Attachment[]>> {
  const response = await api.get(`companies/getAttachmentByCompanyId/${id}`);
  return response as unknown as ApiResponse<Attachment[]>;
}

//Contact
export async function getContactByCompanyId(
  id: number,
): Promise<ApiResponse<Contact[]>> {
  const response = await api.get(`companies/getContactByCompanyId/${id}`);
  return response as unknown as ApiResponse<Contact[]>;
}

//Project
export async function getProjectByCompanyId(
  id: number,
): Promise<ApiResponse<Project[]>> {
  const response = await api.get(`companies/getProjectByCompanyId/${id}`);
  return response as unknown as ApiResponse<Project[]>;
}
