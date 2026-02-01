import { api, ApiResponse } from "@/app/utils/apiClient";

// Define the interfaces based on your API response
export interface DashboardStats {
  title: string;
  count: number;
  subtitle: string;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface DashboardData {
  stats: DashboardStats[];
  ticketStatusDistribution: ChartData[];
  taskStatusDistribution: ChartData[];
  recentQuotes: string[];
  recentContacts: {
    name: string;
    email: string;
  }[];
}

/**
 * Get Dashboard Summary Metrics
 */
export async function getDashboardSummary(): Promise<
  ApiResponse<DashboardData>
> {
  const response = await api.get("dashboard/summary");
  return response as unknown as ApiResponse<DashboardData>;
}
