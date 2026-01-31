import { api, ApiResponse } from "@/app/utils/apiClient";
export interface Media {
  id: number;
  name: string;
  type: "file" | "folder";
  parent_id: number | null;
  path: string;
  size: number | null;
  mime_type: string | null;
  created_by: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaUploadPayload {
  files: File[];
  parent_id?: number | null;
}

export interface MediaRenamePayload {
  name: string;
}

// Get all media items (optionally by parent folder)
export async function getAllMedia(
  parentId?: number | null,
): Promise<ApiResponse<Media[]>> {
  const endpoint = parentId ? `media?parent_id=${parentId}` : "media";
  const response = await api.get(endpoint);
  return response as unknown as ApiResponse<Media[]>;
}

// Create folder
export async function createFolder(
  name: string,
  parentId?: number | null,
): Promise<ApiResponse<Media>> {
  const payload: { name: string; parent_id?: number } = { name };
  if (parentId) {
    payload.parent_id = parentId;
  }
  return api.post("media/folder", payload) as Promise<ApiResponse<Media>>;
}

// Get media by ID
export async function getMediaById(id: number): Promise<ApiResponse<Media>> {
  const response = await api.get(`media/${id}`);
  return response as unknown as ApiResponse<Media>;
}

// Upload media files
export async function uploadMedia(
  files: File[],
  parentId?: number | null,
): Promise<ApiResponse<Media[]>> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  if (parentId) {
    formData.append("parent_id", parentId.toString());
  }

  return api.post("media/upload", formData) as Promise<ApiResponse<Media[]>>;
}

export async function uploadFolder(
  files: File[],
  parentId?: number | null,
): Promise<ApiResponse<Media[]>> {
  const formData = new FormData();

  files.forEach((file) => {
    // Get the relative path (e.g., "CCMT/images/photo.png")
    const relativePath = (file as any).webkitRelativePath;

    if (relativePath) {
      // Create new File with relative path as the name
      const newFile = new File([file], relativePath, { type: file.type });
      formData.append("files", newFile);
    } else {
      formData.append("files", file);
    }
  });

  if (parentId) {
    formData.append("parent_id", parentId.toString());
  }

  return api.post("media/upload", formData) as Promise<ApiResponse<Media[]>>;
}

// Delete file
export async function deleteMediaFile(id: number): Promise<ApiResponse<void>> {
  return api.delete(`media/file/${id}`) as Promise<ApiResponse<void>>;
}

// Delete folder (recursive)
export async function deleteMediaFolder(
  id: number,
): Promise<ApiResponse<void>> {
  return api.delete(`media/folder/${id}`) as Promise<ApiResponse<void>>;
}

// Rename media (file or folder)
export async function renameMedia(
  id: number,
  name: string,
): Promise<ApiResponse<Media>> {
  return api.put(`media/${id}/rename`, { name }) as Promise<ApiResponse<Media>>;
}

// Helper function to delete media (auto-detects type)
export async function deleteMedia(media: Media): Promise<ApiResponse<void>> {
  if (media.type === "folder") {
    return deleteMediaFolder(media.id);
  }
  return deleteMediaFile(media.id);
}
