import { api, ApiResponse } from "@/app/utils/apiClient";

export interface EmailConfig {
  id: number;
  name: string;
  host: string;
  port: string;
  email: string;
  password: string;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllEmailConfig(): Promise<ApiResponse<EmailConfig>> {
  const response = await api.get("email-config");
  return response as unknown as ApiResponse<EmailConfig>;
}

// Create EmailConfig
export async function createEmailConfig(
  data: EmailConfig,
): Promise<ApiResponse<EmailConfig>> {
  return api.post("email-config", data) as Promise<ApiResponse<EmailConfig>>;
}

// Update EmailConfig
export async function updateEmailConfig(
  data: EmailConfig,
): Promise<ApiResponse<EmailConfig>> {
  return api.put(`email-config`, data) as Promise<ApiResponse<EmailConfig>>;
}
