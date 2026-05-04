// الأدوار بتجي الآن ديناميكياً من الـ API عبر roles/api.ts
export type UserRole = string;

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  roles?: string[];
  role?: string;
  created_at?: string;
  assigned_staff?: AssignmentStaff[]; // يجي من GET /users/{id}/assignments
}


export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  is_active: boolean;
  role: string;
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

// ─── Staff Assignment ─────────────────────────────────────────────────────────

// Staff المعين (من داخل assigned_staff)
export interface AssignmentStaff {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles?: string[];
}

// Response من GET /users/{clientId}/assignments
export interface AssignmentsApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    is_active: boolean;
    roles: string[];
    created_at: string;
    assigned_staff: AssignmentStaff[];
  };
}

export interface AssignStaffPayload {
  staff_ids: number[];
}

// ─── Clients assigned to Staff ────────────────────────────────────────────────
export interface AssignedClient {
  id: number;
  name: string;
  email: string;
  roles?: string[];
}

export interface ClientAssignmentsApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    is_active: boolean;
    roles: string[];
    assigned_clients: AssignedClient[];
  };
}



