import apiClient from "@/api/axios";
import type {
  CategoriesApiResponse,
  CategoryDetailResponse,
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "./types";

export const fetchCategories = async (): Promise<CategoriesApiResponse> => {
  const { data } = await apiClient.get<CategoriesApiResponse>("/categories");
  return data;
};

export const fetchCategoryById = async (id: number): Promise<Category> => {
  const { data } = await apiClient.get<CategoryDetailResponse>(`/categories/${id}`);
  return data.data;
};

export const createCategory = async (payload: CreateCategoryPayload): Promise<Category> => {
  const { data } = await apiClient.post<CategoryDetailResponse>("/categories", payload);
  return data.data;
};

export const updateCategory = async (id: number, payload: UpdateCategoryPayload): Promise<Category> => {
  const { data } = await apiClient.put<CategoryDetailResponse>(`/categories/${id}`, payload);
  return data.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};
