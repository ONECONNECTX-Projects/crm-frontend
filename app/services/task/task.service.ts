import { api, ApiResponse } from "@/app/utils/apiClient";
import { OpportunityPayload } from "../opportunity/opportunity.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";

export interface Task {
  id: number;
  name: string;
  OpportunityPayload_id: number;
  company_id: number;
  contact_id: number;
  opportunity_id: number;
  Task_id: number;
  task_type_id: number;
  task_priority_id: number;
  task_status_id: number;
  due_date: Date;
  description: string;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
  OpportunityPayload: OpportunityPayload;
  company: OpportunityPayload;
  contact: Contact;
  opportunity: OpportunityPayload;
  Task: OpportunityPayload;
  type: OpportunityPayload;
  status: OpportunityPayload;
  priority: OpportunityPayload;
}

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
}

export interface TaskPayload {
  name: string;
  assignee_id: number;
  company_id: number;
  contact_id: number;
  opportunity_id: number;
  Task_id: number;
  task_type_id: number;
  task_priority_id: number;
  task_status_id: number;
  due_date: Date;
  description: string;
}

export interface TaskDetail {
  id: number;
  name: string;
  assignee_id: number;
  company_id: number;
  contact_id: number;
  opportunity_id: number;
  quote_id: number;
  task_type_id: number;
  task_priority_id: number;
  task_status_id: number;
  due_date: Date;
  description: string;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
  assignee: Assignee;
  company: Company;
  contact: Contact;
  opportunity: Opportunity;
  quote: Quote;
  type: Status;
  status: Status;
  priority: Priority;
}

export interface Assignee {
  id: number;
  name: string;
  email: string;
  mobile: string;
  password: string;
  role_id: number;
  is_system_admin: boolean;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: number;
  name: string;
  company_size: number;
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
  owner_id: number;
  industry_id: number;
  company_type_id: number;
}

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthday: Date;
  job_title: string;
  owner_id: number;
  company_id: number;
  department_id: number;
  industry_id: number;
  contact_source_id: null;
  contact_stage_id: null;
  twitter: string;
  linkedin: string;
  is_active: boolean;
  is_delete: boolean;
  created_at: Date;
  updated_at: Date;
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
}

export interface Priority {
  id: number;
  name: string;
  color: string;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: number;
  name: string;
  total_amount: string;
  is_active: boolean;
  is_delete: boolean;
  quote_date: Date;
  expiry_date: null;
  terms: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  owner_id: number;
  company_id: number;
  contact_id: number;
  opportunity_id: number;
  quote_stage_id: number;
}

export interface Status {
  id: number;
  name: string;
  is_active: boolean;
  is_delete: boolean;
  created_at: Date;
  updated_at: Date;
}

export async function getAllTask(): Promise<ApiResponse<Task[]>> {
  const response = await api.get("tasks");
  return response as unknown as ApiResponse<Task[]>;
}

// Create Task
export async function createTask(
  data: TaskPayload,
): Promise<ApiResponse<TaskPayload>> {
  return api.post("tasks", data) as Promise<ApiResponse<TaskPayload>>;
}

// Update Task
export async function updateTask(
  id: number,
  data: TaskPayload,
): Promise<ApiResponse<TaskPayload>> {
  return api.put(`tasks/${id}`, data) as Promise<ApiResponse<TaskPayload>>;
}

// Delete Task
export async function deleteTask(id: number): Promise<ApiResponse<void>> {
  return api.delete(`tasks/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveTasks(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("tasks/active/list");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateTaskStatus = (TaskId: number, isActive: boolean) => {
  return api.patch(`tasks/${TaskId}/status`, {
    is_active: isActive,
  });
};

// Update Task Status by task_status_id
export const updateTaskStatusById = (
  taskId: number,
  taskStatusId: number,
): Promise<ApiResponse<TaskDetail>> => {
  return api.patch(`tasks/${taskId}/status`, {
    task_status_id: taskStatusId,
  }) as Promise<ApiResponse<TaskDetail>>;
};
// Get Tasks by ID
export async function getTaskById(
  id: number,
): Promise<ApiResponse<TaskDetail>> {
  const response = await api.get(`tasks/${id}`);
  return response as unknown as ApiResponse<TaskDetail>;
}
