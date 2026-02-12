import { api, ApiResponse } from "@/app/utils/apiClient";

export interface Email {
  id: number;
  subject: string;
  from_email: string;
  to_email: string;
  cc?: string;
  bcc?: string;
  body: string;
  status: "sent" | "draft" | "failed" | "scheduled";
  has_attachment: boolean;
  contact_id?: number;
  company_id?: number;
  opportunity_id?: number;
  quote_id?: number;
  company?: { id: number; name: string };
  contact?: { id: number; first_name: string; last_name: string };
  createdAt: string;
  updatedAt: string;
}

export interface SendEmailPayload {
  to_email: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  contact_id?: string;
  company_id?: string;
  opportunity_id?: string;
  quote_id?: string;
  attachments?: File[];
}

// Send Email (multipart/form-data)
export async function sendEmail(
  data: SendEmailPayload,
): Promise<ApiResponse<Email>> {
  const formData = new FormData();
  formData.append("to_email", data.to_email);
  formData.append("subject", data.subject);
  formData.append("body", data.body);
  if (data.cc) formData.append("cc", data.cc);
  if (data.bcc) formData.append("bcc", data.bcc);
  if (data.contact_id) formData.append("contact_id", data.contact_id);
  if (data.company_id) formData.append("company_id", data.company_id);
  if (data.opportunity_id) formData.append("opportunity_id", data.opportunity_id);
  if (data.quote_id) formData.append("quote_id", data.quote_id);

  if (data.attachments) {
    data.attachments.forEach((file) => {
      formData.append("attachments", file);
    });
  }

  return api.post("email/send", formData) as Promise<ApiResponse<Email>>;
}

// Get All Emails
export async function getAllEmails(): Promise<ApiResponse<Email[]>> {
  const response = await api.get("email");
  return response as unknown as ApiResponse<Email[]>;
}