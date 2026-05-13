// ─── Category Types ────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  parent: Category | null;
  children: Category[];
  count_tasks?: number;
  created_at: string;
}

export interface CategoriesApiResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface CategoryDetailResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CreateRootCategoryPayload {
  name: string;
  description?: string;
}

export interface CreateSubCategoryPayload {
  name: string;
  description?: string;
  parent_id: number;
  count_tasks?: number;
}

export type CreateCategoryPayload = CreateRootCategoryPayload | CreateSubCategoryPayload;

export interface UpdateCategoryPayload {
  name: string;
  description?: string;
  parent_id?: number | null;
  count_tasks?: number;
}
