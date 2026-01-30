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
  OpportunityPayload: OptionDropDownModel;
  company: OptionDropDownModel;
  contact: OptionDropDownModel;
  opportunity: OptionDropDownModel;
  Task: OptionDropDownModel;
  type: OptionDropDownModel;
  status: OptionDropDownModel;
  priority: OptionDropDownModel;
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

export interface TaskCommentPayload {
  comment: string;
  attachment: File;
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
  assignee: OptionDropDownModel;
  company: OptionDropDownModel;
  contact: OptionDropDownModel;
  opportunity: OptionDropDownModel;
  quote: OptionDropDownModel;
  type: OptionDropDownModel;
  status: OptionDropDownModel;
  priority: OptionDropDownModel;
  comments: Comment[];
}

export interface Comment {
  id: number;
  comment: string;
  is_delete: boolean;
  task_id: number;
  user_id: number;
  user: OptionDropDownModel;
  attachments: Attachment[];
}

export interface Attachment {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  task_comment_id: number;
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

export async function createTaskComment(
  id: number,
  data: TaskCommentPayload,
): Promise<ApiResponse<Attachment>> {
  const formData = new FormData();

  formData.append("comment", data.comment);
  formData.append("attachment", data.attachment);
  return api.post(`task-comments/${id}/comment`, formData) as Promise<
    ApiResponse<Attachment>
  >;
}

export async function deleteTaskComment(
  id: number,
): Promise<ApiResponse<void>> {
  return api.delete(`task-comments/comment/${id}`) as Promise<
    ApiResponse<void>
  >;
}
