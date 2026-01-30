import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";

export interface AttachmentPayload {
  owner_id: string;
  company_id: string;
  contact_id: string;
  opportunity_id: string;
  quote_id: string;
  attachment: File;
}

export interface Attachment {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  owner_id: number;
  company_id: number;
  contact_id: number;
  opportunity_id: number;
  quote_id: number;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: OptionDropDownModel;
  company: OptionDropDownModel;
  contact: OptionDropDownModel;
  opportunity: OptionDropDownModel;
  quote: OptionDropDownModel;
}

export async function getAllAttachments(): Promise<ApiResponse<Attachment[]>> {
  const response = await api.get("attachments");
  return response as unknown as ApiResponse<Attachment[]>;
}

export async function createAttachment(
  data: AttachmentPayload,
): Promise<ApiResponse<Attachment>> {
  const formData = new FormData();

  formData.append("owner_id", data.owner_id);
  formData.append("company_id", data.company_id);
  formData.append("contact_id", data.contact_id);
  formData.append("opportunity_id", data.opportunity_id);
  formData.append("quote_id", data.quote_id);
  formData.append("attachment", data.attachment);

  return api.post("attachments", formData) as Promise<ApiResponse<Attachment>>;
}

export async function deleteAttachment(id: number): Promise<ApiResponse<void>> {
  return api.delete(`attachments/${id}`) as Promise<ApiResponse<void>>;
}
export async function getAttachmentById(
  id: number,
): Promise<ApiResponse<Attachment>> {
  const response = await api.get(`attachments/${id}`);
  return response as unknown as ApiResponse<Attachment>;
}
