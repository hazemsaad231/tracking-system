export const USER_ROLES = [
  { value: "admin",      label: "مسؤول" },
  { value: "writer",     label: "كاتب" },
  { value: "client",     label: "عميل" },
  { value: "accountant", label: "محاسب" },
  { value: "reviewer",   label: "مراجع" },
] as const;

export type UserRole = typeof USER_ROLES[number]["value"];

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  roles?: string[];
  role?: string;
  created_at?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  is_active: boolean;
  role: UserRole;
}

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, "password">> & {
  password?: string;
};

export interface ApiResponse {
  data: User[];
  links: {
    first: string | null;
    last: string | null;
    next: string | null;
    prev: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface UserDetailResponse {
  success: boolean;
  message: string;
  data: User;
}
