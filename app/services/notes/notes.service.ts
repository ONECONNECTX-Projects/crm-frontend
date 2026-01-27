import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { api, ApiResponse } from "@/app/utils/apiClient";
import { Priority } from "../priority/priority.service";

export interface NotesPayload {
  title: string;
  owner_id: string;
  company_id: string;
  contact_id: string;
  opportunity_id: string;
  quote_id: string;
  description: string;
}

export interface Notes {
  id: number;
  title: string;
  owner_id: number;
  company_id: number;
  contact_id: number;
  opportunity_id: number;
  quote_id: number;
  description: string;
  is_active: boolean;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: OptionDropDownModel;
  company: OptionDropDownModel;
  contact: {
    id: number;
    first_name: string;
    last_name: string;
  };
  opportunity: OptionDropDownModel;
  quote: OptionDropDownModel;
}

// Get all Notes
export async function getAllNote(): Promise<ApiResponse<Notes[]>> {
  const response = await api.get("notes");
  return response as unknown as ApiResponse<Notes[]>;
}

// Create Note
export async function createNote(
  data: NotesPayload,
): Promise<ApiResponse<NotesPayload>> {
  return api.post("notes", data) as Promise<ApiResponse<NotesPayload>>;
}

// Update Note
export async function updateNote(
  id: number,
  data: NotesPayload,
): Promise<ApiResponse<NotesPayload>> {
  return api.put(`notes/${id}`, data) as Promise<ApiResponse<NotesPayload>>;
}

// Delete Note
export async function deleteNote(id: number): Promise<ApiResponse<void>> {
  return api.delete(`notes/${id}`) as Promise<ApiResponse<void>>;
}

export async function getAllActiveNotes(): Promise<
  ApiResponse<OptionDropDownModel[]>
> {
  const response = await api.get("notes/active");
  return response as unknown as ApiResponse<OptionDropDownModel[]>;
}

export const updateNoteStatus = (NoteId: number, isActive: boolean) => {
  return api.patch(`notes/${NoteId}/status`, {
    is_active: isActive,
  });
};

// Get Notes by ID
export async function getNoteById(id: number): Promise<ApiResponse<Notes>> {
  const response = await api.get(`notes/${id}`);
  return response as unknown as ApiResponse<Notes>;
}
