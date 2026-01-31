import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";
import { ContactSource } from "../contact-source/contact-source.service";
import { ContactStage } from "../contact-stages/contact-stages.service";
import { Industry } from "../Industry/industry.service";
import { Opportunity } from "../opportunity/opportunity.service";
import { Task } from "../task/task.service";
import { Notes } from "../notes/notes.service";
import { Quote } from "../quote/quote.service";
import { Attachment } from "../attachment/attachement.service";
import { Ticket } from "../tickets/tickets.service";

// Contact info for create/update
export interface ContactInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthday: string;
  job_title: string;
  owner_id: string;
  company_id: string;
  department_id: string;
  industry_id: string;
  contact_source_id: string;
  contact_stage_id: string;
  twitter: string;
  linkedin: string;
}

// Address info for create/update
export interface ContactAddress {
  present_address: string;
  present_city: string;
  present_state: string;
  present_zip: string;
  present_country: string;
  permanent_address: string;
  permanent_city: string;
  permanent_state: string;
  permanent_zip: string;
  permanent_country: string;
}

// Complete Contact payload for create/update
export interface ContactPayload {
  contact: ContactInfo;
  address: ContactAddress;
}

// Contact response from API (with all relations)
export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthday: string;
  job_title: string;
  owner_id: string;
  company_id: string;
  department_id: string;
  industry_id: string;
  contact_source_id: string;
  contact_stage_id: string;
  twitter: string;
  linkedin: string;
  is_active: boolean;
  is_delete: boolean;
  created_at: string;
  updated_at: string;
  owner?: {
    id: number;
    name: string;
  };
  company?: {
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  };
  source?: ContactSource;
  stage?: ContactStage;
  industry?: Industry;
  address?: ContactAddress;
}

// Get all Contacts
export async function getAllContacts(): Promise<ApiResponse<Contact[]>> {
  const response = await api.get("contacts");
  return response as unknown as ApiResponse<Contact[]>;
}

// Get contact by ID
export async function getContactById(
  id: number,
): Promise<ApiResponse<Contact>> {
  const response = await api.get(`contacts/${id}`);
  return response as unknown as ApiResponse<Contact>;
}

// Create Contact
export async function createContact(
  data: ContactPayload,
): Promise<ApiResponse<Contact>> {
  return api.post("contacts", data) as Promise<ApiResponse<Contact>>;
}

// Update Contact
export async function updateContact(
  id: number,
  data: ContactPayload,
): Promise<ApiResponse<Contact>> {
  return api.put(`contacts/${id}`, data) as Promise<ApiResponse<Contact>>;
}

// Delete Contact
export async function deleteContact(id: number): Promise<ApiResponse<void>> {
  return api.delete(`contacts/${id}`) as Promise<ApiResponse<void>>;
}

// Get all active contacts for dropdown
export async function getAllActiveContacts(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("contacts/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

// Update contact status
export const updateContactStatus = (contactId: number, isActive: boolean) => {
  return api.patch(`contacts/${contactId}/status`, {
    is_active: isActive,
  });
};

//Get Pages By Id

//Opportunity
export async function getOpportunityByContactId(
  id: number,
): Promise<ApiResponse<Opportunity[]>> {
  const response = await api.get(`contacts/getOpportunityByContactId/${id}`);
  return response as unknown as ApiResponse<Opportunity[]>;
}

//Task
export async function getTaskByContactId(
  id: number,
): Promise<ApiResponse<Task[]>> {
  const response = await api.get(`contacts/getTaskByContactId/${id}`);
  return response as unknown as ApiResponse<Task[]>;
}

//Notes
export async function getNotesByContactId(
  id: number,
): Promise<ApiResponse<Notes[]>> {
  const response = await api.get(`contacts/getNoteByContactId/${id}`);
  return response as unknown as ApiResponse<Notes[]>;
}

//Quote
export async function getQuoteByContactId(
  id: number,
): Promise<ApiResponse<Quote[]>> {
  const response = await api.get(`contacts/getQuoteByContactId/${id}`);
  return response as unknown as ApiResponse<Quote[]>;
}

//Attachment
export async function getAttachmentByContactId(
  id: number,
): Promise<ApiResponse<Attachment[]>> {
  const response = await api.get(`contacts/getAttachmentByContactId/${id}`);
  return response as unknown as ApiResponse<Attachment[]>;
}

//Ticket
export async function getTicketByContactId(
  id: number,
): Promise<ApiResponse<Ticket[]>> {
  const response = await api.get(`contacts/getTicketByContactId/${id}`);
  return response as unknown as ApiResponse<Ticket[]>;
}
