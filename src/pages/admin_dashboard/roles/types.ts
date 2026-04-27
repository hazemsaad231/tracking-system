export interface Role {
  id: number;
  name: string;
  permissions: string[];
  created_at: string;
}

export interface RolesApiResponse {
  success: boolean;
  message: string;
  data: Role[];
}

export interface RoleDetailResponse {
  success: boolean;
  message: string;
  data: Role;
}

export interface CreateRolePayload {
  name: string;
  permissions: string[];
}

export type UpdateRolePayload = CreateRolePayload;

// payload خاص بتحديث الصلاحيات فقط بدون الاسم
export interface UpdateRolePermissionsPayload {
  permissions: string[];
}
