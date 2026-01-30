import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Ticket {
  id: number;
  email: string;
  subject: string;
  description: string;
  contact_id: number;
  ticket_category_id: number;
  priority_id: number;
  ticket_status_id: number;
  created_by: number;
  customer: OptionDropDownModel;
  category: OptionDropDownModel;
  priority: OptionDropDownModel;
  status: OptionDropDownModel;
  attachments: Attachment[];
}

export interface Attachment {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  createdAt: Date;
  updatedAt: Date;
  ticket_reply_id: number;
}

export interface TicketDetail {
  id: number;
  email: string;
  subject: string;
  description: string;
  contact_id: number;
  ticket_category_id: number;
  priority_id: number;
  ticket_status_id: number;
  created_by: number;
  customer: OptionDropDownModel;
  category: OptionDropDownModel;
  priority: OptionDropDownModel;
  status: OptionDropDownModel;
  attachments: Attachment[];
  replies: Reply[];
}

export interface Reply {
  id: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  ticket_id: number;
  user_id: number;
  user: OptionDropDownModel;
  attachments: Attachment[];
}

export interface TicketPayload {
  email: string;
  subject: string;
  description: string;
  contact_id: string;
  ticket_category_id: string;
  priority_id: string;
  ticket_status_id: string;
  attachments: File;
}

export interface TicketReplyPayload {
  description: string;
  attachment: File;
}

export async function getAllTicket(): Promise<ApiResponse<Ticket[]>> {
  const response = await api.get("tickets");
  return response as unknown as ApiResponse<Ticket[]>;
}

// Create Ticket
export async function createTicket(
  data: TicketPayload,
): Promise<ApiResponse<Ticket>> {
  return api.post("tickets", data) as Promise<ApiResponse<Ticket>>;
}

export async function updateTicketStatusById(
  ticketId: number,
  statusId: number,
): Promise<ApiResponse<Ticket>> {
  return api.patch(`tickets/${ticketId}/status`, {
    ticket_status_id: statusId,
  }) as Promise<ApiResponse<Ticket>>;
}

// Get Tickets by ID
export async function getTicketById(
  id: number,
): Promise<ApiResponse<TicketDetail>> {
  const response = await api.get(`tickets/${id}`);
  return response as unknown as ApiResponse<TicketDetail>;
}

export async function createTicketReply(
  id: number,
  data: TicketReplyPayload,
): Promise<ApiResponse<Reply>> {
  const formData = new FormData();

  formData.append("description", data.description);
  formData.append("attachment", data.attachment);
  return api.post(`ticket-reply/${id}/reply`, formData) as Promise<
    ApiResponse<Reply>
  >;
}
