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

// قائمة الصلاحيات المتاحة (يمكن جلبها من API لاحقاً إذا لزم الأمر)
export const AVAILABLE_PERMISSIONS = [
  { value: "manage-users", label: "إدارة المستخدمين" },
  { value: "view-users", label: "عرض المستخدمين" },
  { value: "manage-roles", label: "إدارة الأدوار" },
  { value: "view-roles", label: "عرض الأدوار" },
  { value: "manage-permissions", label: "إدارة الصلاحيات" },
  { value: "view-permissions", label: "عرض الصلاحيات" },
];
