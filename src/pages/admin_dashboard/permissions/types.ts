export interface Permission {
  id: number;
  name: string;
  created_at: string;
}

export interface PermissionsApiResponse {
  success: boolean;
  message: string;
  data: Permission[];
}

export interface PermissionDetailResponse {
  success: boolean;
  message: string;
  data: Permission;
}

export interface CreatePermissionPayload {
  name: string;
}
