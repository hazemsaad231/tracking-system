import apiClient from "@/api/axios";
import type { CategoryFilesApiResponse, FileDetailResponse, CategoryFile, UploadFilePayload } from "./types";

// GET /categories/{categoryId}/files
export const fetchCategoryFiles = async (categoryId: number): Promise<CategoryFilesApiResponse> => {
  const { data } = await apiClient.get<CategoryFilesApiResponse>(`/categories/${categoryId}/files`);
  return data;
};

// GET /categories/{categoryId}/files/{fileId}
export const fetchFileById = async (categoryId: number, fileId: number): Promise<CategoryFile> => {
  const { data } = await apiClient.get<FileDetailResponse>(`/categories/${categoryId}/files/${fileId}`);
  return data.data;
};

// POST /categories/{categoryId}/files  (multipart/form-data)
export const uploadFile = async (categoryId: number, payload: UploadFilePayload): Promise<CategoryFile> => {
  const formData = new FormData();
  if (payload.file) formData.append("file", payload.file);
  formData.append("title", payload.title);
  if (payload.description?.trim()) formData.append("description", payload.description.trim());
  formData.append("category_id", String(categoryId));

  const { data } = await apiClient.post<FileDetailResponse>(`/categories/${categoryId}/files`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

// POST /categories/{categoryId}/files/{fileId}  (update)
export const updateFile = async (categoryId: number, fileId: number, payload: UploadFilePayload): Promise<CategoryFile> => {
  const formData = new FormData();
  if (payload.file) formData.append("file", payload.file);
  formData.append("title", payload.title);
  if (payload.description?.trim()) formData.append("description", payload.description.trim());

  const { data } = await apiClient.post<FileDetailResponse>(`/categories/${categoryId}/files/${fileId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

// DELETE /categories/{categoryId}/files/{fileId}
export const deleteFile = async (categoryId: number, fileId: number): Promise<void> => {
  await apiClient.delete(`/categories/${categoryId}/files/${fileId}`);
};
